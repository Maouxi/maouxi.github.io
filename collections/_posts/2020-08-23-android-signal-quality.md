---
title: Get the mobile signal strength on Android
icons: [android]
skills: [Android, Kotlin]
---

Getting the mobile signal strength on Android has different behavior by the minimum API level you target.

* [Difference by API](#difference-by-api)  
* [Let's code](#lets-code)
    * [Android API >= 29](#android-api--29)
    * [Android API >= 23](#android-api--23)
    * [Android API >= 17](#android-api--17)
* [All together](#all-together)

## Difference by API 

- *Android API >= 29 (10 - Q)* use the TelephonyService and register for the signal strength event. 

- *Android API >= 23 (6 - Marshmallow)* Same as Android Q but you get some limitation on the received callback. Maybe you have to look at the Android 4.2 API.

- *Android API >= 17 (4.2 - Jelly Bean)* you have to use the TelephonyService and register for the cell info event and add permission to the coarce location. 

- *Others* at the time I write this article they are 0.8%. I don't investigate more. [Android distribution by api version](#android-distribution-by-api-version)

## Let's code

### Android API >= 29

Ok, that's the easy part! 
You need to access the Android TelephonyService, And register to the `LISTEN_SIGNAL_STRENGTHS` event. 

```kotlin
val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
telephonyManager.listen(this, LISTEN_SIGNAL_STRENGTHS)
```

Because we use `this` into the `listen()` method, we need to extend `PhoneStateListener` where this method is called. Feel free to use a separate class. 

Now we can override the `onSignalStrengthsChanged()` method of the PhoneStateListener class that will be called when the signal strength changed:

```kotlin
override fun onSignalStrengthsChanged(signalStrength: SignalStrength?) {
    // Direct access to 0-4 strength level or null. 
    var strength = signalStrength?.level

    // You can get more informations about the signal
    var cellStrenghts = signalStrength?.cellSignalStrength
}
```

We got a SignalStrength object. You can call both the `getLevel()` (it could be enough for most of usages) and `getCellSignalStrengths()` methods. 
- getLevel: gives you the signal strength. From 0 to 4. ([level signification](#signal-strength-values))
- getCellSignalStrengths: gives you a list of CellSignalStrength that provide more granular information about the signal.

> Note that the first time you listen for this event the callback is called once. Then it will be called only if a change appear. 

### Android API >= 23

This is exactly the same as the API >= 29 but in the `onSignalStrengthsChanged()` callback you can't use the `getCellSignalStrengths()` method.
More precisely, you can build your app, but on runtime you will get a `NoSuchMethodError`:

```
java.lang.NoSuchMethodError: 
No virtual method getCellSignalStrengths()Ljava/util/List;
```

If you need more informations about the signal strength you have to jump to the next section. 

> Validate is trully necessary for your use case to request access to the `getCellSignalStrengths()`. You are going to add the location permission. This permission need to be requested at runtime on Android 23 and above and and makes implementation more difficult. Also, user don't really likes to share their position if they don't know why!

### Android API >= 17

You need to add the `ACCESS_COARSE_LOCATION` permission to the manifest. 
Why!? I don't find an offical doc. But this callback gives more information than the simple signal strength, and it probably can be used to localize the user.

```xml
<manifest>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
</manifest>
```

Then register on the telephony service for the `LISTEN_CELL_INFO` event. 
Notice than we need to check if the permission is granted for the coarse location on level API >= 23. Bellow API 23 the permission is granted when the user install the app.

```kotlin
val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ){
    // This check need to be done only for API >= 23. A permission request need to be done if access is not granted.
    ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED -> {
        telephonyManager.listen(this, LISTEN_CELL_INFO)
    }
} else {
    telephonyManager.listen(this, LISTEN_CELL_INFO)
}
```

If you read the begining of this article, same behavior, we use `this` into the `listen()` method, so we need to extend `PhoneStateListener`.
Now we can override the `onCellInfoChanged()` method of the PhoneStateListener class that will be called when the signal strength changed:

```kotlin
override fun onCellInfoChanged(cellInfos: MutableList<CellInfo>?) {
    super.onCellInfoChanged(cellInfos)
    // 0-4 strength level or null. ([level signification](#signal-strength-values))
    val strengthLevel = if (cellInfos != null && cellInfos.isNotEmpty()) {
        cellInfos.map { cellInfo ->
            when (cellInfo) {
                is CellInfoGsm -> cellInfo.cellSignalStrength.level
                is CellInfoLte -> cellInfo.cellSignalStrength.level
                is CellInfoCdma -> cellInfo.cellSignalStrength.level
                is CellInfoWcdma -> cellInfo.cellSignalStrength.level
                is CellInfoNr -> cellInfo.cellSignalStrength.level
                is CellInfoTdscdma -> cellInfo.cellSignalStrength.level
                else -> -1
            }
        }.maxBy { signalStrength -> signalStrength }.takeIf { res -> res != null && res >= 0 }
    } else {
        null
    }
}
```

## All together

If you only want the signal strength. You can avoid to handle the permission request at runtime. Here is a working code to simply get the signal strength with a  17 min sdk API. 

We use the location permision in the manifest but only for API before 23

```xml
<manifest>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="22" />
</manifest>
```

Then we listen events differently by API version: 

```kotlin
class SignalStrengthService(val context: Context) : PhoneStateListener() {

    private val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    private var signalStrengthListener: (Int) -> Unit = { }

    // Initialise the signal strength changes
    fun listenToSignalStrengthChanges(){
        when {
            // API >= 23
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.M -> telephonyManager.listen(this, LISTEN_SIGNAL_STRENGTHS)
            // API >= 17
            else -> telephonyManager.listen(this, LISTEN_CELL_INFO)
        }    
    }

    // Listen to signal strength changes
    fun listenSignalStrengths(listener: (Int) -> Unit) {
        this.signalStrengthListener = listener
    }

    @RequiresApi(Build.VERSION_CODES.M)
    override fun onSignalStrengthsChanged(signalStrength: SignalStrength?) {
        super.onSignalStrengthsChanged(signalStrength)
        val currentSignalStrength = signalStrength?.level
        if(currentSignalStrength != null) signalStrengthListener(currentSignalStrength)
    }

    override fun onCellInfoChanged(cellInfos: MutableList<CellInfo>?) {
        super.onCellInfoChanged(cellInfos)
        val currentSignalStrength = if (cellInfos != null && cellInfos.isNotEmpty()) {
            cellInfos.map { cellInfo ->
                when (cellInfo) {
                    is CellInfoGsm -> cellInfo.cellSignalStrength.level
                    is CellInfoLte -> cellInfo.cellSignalStrength.level
                    is CellInfoCdma -> cellInfo.cellSignalStrength.level
                    is CellInfoWcdma -> cellInfo.cellSignalStrength.level
                    is CellInfoNr -> cellInfo.cellSignalStrength.level
                    is CellInfoTdscdma -> cellInfo.cellSignalStrength.level
                    else -> -1
                }
            }.maxBy { signalStrength -> signalStrength }.takeIf { res -> res != null && res >= 0 }
        } else {
            null
        }
        if(currentSignalStrength != null) signalStrengthListener(currentSignalStrength)
    }
}
```

## Annex

### Signal strength values
- 0 No signal
- 1 Poor signal
- 2 Moderate signal
- 3 Good signal
- 4 Excelent signal

### Android distribution by API version

| ![Android distribution by API version](/assets/img/blog/android-signal-quality/android-api-2020.PNG){:style="width:500px;"} | 
| Source: Android Studio (August 2020) |