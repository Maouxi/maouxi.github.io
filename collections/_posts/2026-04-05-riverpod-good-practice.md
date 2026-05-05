---
title: Riverpod Good Practices
icons: [flutter]
skills: [Flutter, Dart, Riverpod]
---

Riverpod good practices

- [Library basics reminder](#library-basics-reminder)
  - [Provider scope](#provider-scope)
  - [Providers type](#providers-type)
  - [Family providers](#family-providers)
  - [Providers usage](#providers-usage)
  - [Default behavior](#default-behavior)
- [Keep it simple](#keep-it-simple)
- [Doing it well](#doing-it-well)
  - [Do not re-invent the wheel](#do-not-re-invent-the-wheel)
  - [One provider, one state](#one-provider-one-state)
  - [Keep alive or not keep alive?](#keep-alive-or-not-keep-alive)
  - [Don't be shy with families](#dont-be-shy-with-families)
  - [I need to reset my whole state](#i-need-to-reset-my-whole-state)
- [Tips](#tips)
  - [Use `ref.select` to limit rebuilds](#use-refselect-to-limit-rebuilds)
  - [React without rebuilding — `ref.listen`](#react-without-rebuilding--reflisten)

Riverpod is state management first, not a DI system. You can use it for DI but always remember it's not designed for DI but for state management.

While the library itself is simple, its usage isn't straightforward and the documentation could be better organized.

## Library basics reminder

### Provider scope

At the topmost level where you need app state you have to put the `ProviderScope` widget. It will keep all your providers/app state.

### Providers type

There are two kinds of providers

1. Immutable:

     ```dart
     @riverpod
     String appVersion(Ref ref) => "1.0.0";
     ```

2. Mutable:

    ```dart
    @riverpod
    class CounterNotifier extends _$CounterNotifier {
        @override
        int build() => 1;

        void increment() =>  state = state + 1;
    }
    ```

For each of them your provider can return synchronously, as in the sample. Or be async with return type  `Future`, or `Stream`.

__⚠️ Be careful: Immutable providers can change over time! You can always react to other provider changes to stay up to date.__

### Family providers

Family providers can be seen as a provider with one or more arguments.

```dart
@riverpod
Item item(Ref ref, int id) => Item(id:  id);
```

### Providers usage

Three ways to access your providers.

1. `ref.read` => last state of the provider at the time it is accessed. Basic usage is to call mutation on the provider to update its state.  
2. `ref.watch` => last state of the provider at the time it is accessed, triggers rebuild on state change. Basic usage is in the widget build method, or in provider creation to always be in line with the state when changes happen.
3. `ref.listen` => last state of the provider at the time it is accessed, triggers on state change, doesn't rebuild. Basic usage is to react to app events that don't need a widget tree rebuild. For example to display a snackbar.

__⚠️ Inside providers, always use `ref.watch` to read dependencies — not `ref.read`. Using `ref.read` inside a provider body creates a one-time snapshot with no reactive link; the provider won't update when that dependency changes.__

### Default behavior

- Providers are auto-disposed by default. If nobody in the current widget tree has a reference to them with `ref.watch` or `ref.listen` the provider is disposed.

## Keep it simple

The library is simple, keep it simple.

Riverpod is for global state management, if you are in a local scope you don't need it. [source](https://docs-v2.riverpod.dev/docs/concepts/about_hooks).

The documentation is clear, Riverpod can be used alone, but it's recommended to use it with Flutter's native state management (`StatefulWidget` + `flutter_riverpod`) or with Flutter hooks (`flutter_hooks` + `hooks_riverpod`). Don't overcomplicate things.

Many developers try to match the MVVM pattern, but it's clear Riverpod is not the right library for that! I come from Windows (and Windows Phone) where MVVM is the single way to go, then to Android where MVVM is the core of the good practices — it's really not the case in Flutter.

So if I want to build the good old counter widget with Riverpod I will do it like this:

```dart
class Counter extends HookWidget {
  const Counter({super.key});

  @override
  Widget build(BuildContext context) {
    final counter = useState(0);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              counter.value.toString(),
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            ElevatedButton(
              onPressed: () => counter.value++,
              child: Text("Increment"),
            ),
          ],
        ),
      ),
    );
  }
}
```

I really don't need a provider and Riverpod here, I have a local state, that increments locally.
Hook is just syntactic sugar to avoid the `StatefulWidget` and `useState` from the Flutter SDK.

Riverpod becomes very useful when we need to share state between screens/widgets. A user, a cart, user vehicles...

## Doing it well

### Do not re-invent the wheel

I see many verbose and error-prone code like this:

```dart
@freezed
sealed class AppState with _$AppState{
  AppState._();
  factory AppState.data(String value) = AppStateData;
  factory AppState.error(Object error) = AppStateError;
  factory AppState.loading() = AppStateLoading;
}

@riverpod
class AppStateController extends _$AppStateController {
  @override
  AppState build() => AppStateLoading();

  Future<void> fetch() {
    try {
      var data = ref.read(dataRepository).fetch();
      state = AppStateData(data);
    }
    catch(e){
      state = AppStateError(e);
    }
  }
 }

class MyWidget extends ConsumerStatefulWidget {

  @override
  void initState(){
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(appStateControllerProvider).fetch();
    });
  }

  @override
  Widget build(){
    var state = ref.watch(appStateControllerProvider);
    return switch(state){
      AppStateLoading() => Text("loading"),
      AppStateError(:final e) => Text("error"),
      AppStateData(:final data) => Text("data"),
    };
  }
}
```

It starts well, a sealed class is a good idea for state, we can switch between different statuses and adapt the UI. Perfect.
Then problems come:  

1. AppState is clearly a Riverpod AsyncValue.
2. The AppStateController doesn't auto-fetch.
3. Each time this controller is rebuilt it will go to the loading state. No cache system, no preserved state across rebuilds.
4. The widget that needs the AppState takes the responsibility to call fetch and init the provider.
5. The widget does it in its initState, it must be done after the widget builds a first time for nothing and violates the separation of concerns.
6. The fetch is asynchronous and it is called without await to not block the UI. So it runs in background even if the widget disposes (memory leak/wasted work).

Here's how to solve it. Riverpod has out of the box a Future provider that handles loading/error cases.

```dart
@freezed
abstract class AppState with _$AppState {
  const factory AppState({required String value}) = _AppState;
}

@riverpod
Future<AppState> appStateController(Ref ref){
  var repository = ref.watch(dataRepository);
  return repository.fetch();
}

class MyWidget extends ConsumerWidget {

  @override
  Widget build(BuildContext context, WidgetRef ref){
    var state = ref.watch(appStateControllerProvider);
    return state.when(
      data: (data) => Text("data"),
      error: (e) => Text("error"),
      loading: () => Text("loading"),
    );
  }
}
```

In "notifier" providers you can use `AsyncValue.guard`. It is an handy shortcut that wraps an async call in try/catch automatically:

```dart
@riverpod
class AppStateController extends _$AppStateController {
  @override
  Future<AppState> build(){
    var repository = ref.watch(dataRepository);
    return repository.fetch();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(dataRepository).fetch());
  }
}
    
```

### One provider, one state

Try to not make a provider into a spaghetti mess. If you try to put the state of one entire screen into one provider you're doing it wrong.

Maybe all the state is not only for this screen, some must be shared, now or in the future. Mixing different features/use cases in the same provider is going to be hard to maintain and read.

If you want for example a screen with a list of items, also displaying at the top a searchbar and filters, you can split everything into multiple providers that each handle only one thing.

```dart
@riverpod
class FiltersNotifier extends _$FiltersNotifier {
  @override
  FilterState build() => FilterState.initial();

  void set(FilterState filters) => state = filters;
}

@riverpod 
class Query extends _$Query{
  @override
  String build() => "";

  void set(String query) => state = query;
}

@riverpod
Future<List<Item>> items(Ref ref) async {
  // Combine providers
  var filters = ref.watch(filtersProvider);
  var query = ref.watch(queryProvider);
  return ref.watch(dataRepository).getItems(filters, query);
}

class ItemListScreen extends HookConsumerWidget {

  @override
  Widget build(BuildContext context, WidgetRef ref){
    var itemsAsync = ref.watch(itemsProvider);
    return SingleChildScrollView(
      child: Column(
        children: [
          TextField(
            onChanged: (value) => ref.read(queryProvider.notifier).set(value),
            decoration: InputDecoration(labelText: "Query"),
          ),
          FilterWidget(
            onFiltersChanged: (filters) => ref.read(filtersProvider.notifier).set(filters),
          ),
          Expanded(
            child: itemsAsync.when(
              data: (items) => ListView(...),
              error: (e) => Center(child: Text("error")),
              loading: () => Center(child: Text("loading")),
            )
          )
        ]
      )
    )
  }
}
```

You can easily implement pull to refresh with `ref.invalidate(itemsProvider)`.

Also the `AsyncValue.when` can accomplish a little more:

- `skipLoadingOnReload` (false by default) do not go to loading state when provider rebuilds. For example when updating query or filter and keeping data displayed.
- `skipLoadingOnRefresh` (true by default) do not go to loading state when refreshing/invalidating. For example to display a spinner above the data for a pull to refresh.
- `skipError` (false by default) do not go to error state if previous data exists. For example display an error in a snackbar for a pull to refresh while keeping the data displayed.

The current state can be get with `hasError`, `isLoading` on the AsyncValue.

With this implementation if you want to have a default filter updatable in user settings for example, the code is going to be very simple without searching through a hundred lines of code files.

```dart
@riverpod
class Filters extends _$Filters {
  @override
  Future<Filters> build() async {
    var userSettings = ref.watch(userSettingsProvider);
    return userSettings.getDefaultFilters();
  }

  void set(Filters filters) => state = AsyncData(filters);
}
```

You want to add debounce to the search bar:

```dart
@riverpod
class Query extends _$Query {
  CancelableOperation<String>? _pending;

  @override
  Future<String> build() async {
    return "";
  }

  Future<void> set(String query) async {
    await _pending?.cancel();
    _pending = CancelableOperation.fromFuture(
      Future.delayed(const Duration(milliseconds: 500), () => query),
    );
    final result = await _pending!.valueOrCancellation();
    if (result != null) {
      state = AsyncData(result);
    }
  }
}
```

Small change required because filters and query become asynchronous:

```dart
@riverpod
Future<List<Item>> items(Ref ref) async {
  // Combine providers
  var filters = await ref.watch(filtersProvider.future);
  var query = await ref.watch(queryProvider.future); 
  return ref.watch(dataRepository).getItems(filters, query);
}
```

### Keep alive or not keep alive?

As said before, by default providers are auto-disposed.
Keep alive will change this behavior, and when the provider is created it will never be destroyed. Think of this like a singleton in a DI system.

Two ways to keep a provider alive:

```dart
@Riverpod(keepAlive: true)
String hello(Ref ref) => "hello";
```

```dart
@riverpod
String userUid(Ref ref) {
  var user = ref.watch(authStateChanged);
  if(user == null) return "";
  ref.keepAlive();
  return user.uid;
}
```

The Best Practice: Use keepAlive: true only for global, immutable settings or caches that you are 100% sure you want to persist across the entire app lifetime. For everything else, rely on default autoDispose behavior and use ref.keepAlive() programmatically only when a specific, successful condition is met.

Possible usage:

- Permission state
- Platform info
- Open database connection
- Objects that are already singletons

### Don't be shy with families

If you are in a basic master/details scenario. Your screen displays at the top a list of items, and on the bottom in a bottom sheet the details. How to handle this with Riverpod.

Again I saw this:

```dart

@riverpod
class ItemController extends _$ItemController {
  @override
  Item? build() => null;

  Future<void> fetch(int id) async{
    state = await ref.read(dataRepository).fetch(id : id);
  }
 }

class DetailsView extends StatefulHookConsumerWidget {
  final int id;
  const DetailsView({super.key, required this.id});

  @override
  ConsumerState<DetailsView> createState() => _DetailsViewState();
}

class _DetailsViewState extends ConsumerState<DetailsView> {
  @override
  void initState(){
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(itemControllerProvider.notifier).fetch(widget.id);
    });
  }

  @override
  Widget build(BuildContext context){
    var item = ref.watch(itemControllerProvider)
    //...
  }
}
```

I will not again explain issues with this initState and fetch in a postFrameCallback. But here we have another issue:  

1. The ItemController will not be disposed even if a new item is clicked.
2. The DetailsView is rebuilt with another id, but will still display the old item controller value until the post frame callback is called. So the state is corrupted.

The solution is very easy with Riverpod family:

```dart
@riverpod
Future<Item> item(Ref ref, int id) async {
  return ref.watch(dataRepository).getItem(id);
}

class DetailsView extends ConsumerWidget {
  final int id;
  const DetailsView({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref){
    var item = ref.watch(itemProvider(id))
    //...
  }
}
```

__⚠️ Family arguments are used as cache keys. For custom classes, override `==` and `hashCode` (or use `@freezed`) — otherwise two logically equal instances create two separate providers.__

### I need to reset my whole state

You don't need this, and should not do this!

It's an anti-pattern and so, Riverpod doesn't provide this feature. Providers auto-dispose when not "listened" and by construction are refreshed on state change. You don't need to reset all the state.

Common usage is: I logout my user and I want all providers that depend on it to reset, to not keep old user data in my state. It's very easy with Riverpod to avoid this. Just "watch" the user provider inside providers that depend on it.

```dart
@riverpod
Stream<User?> authStateChanged(Ref ref) => FirebaseAuth.instance.authStateChanges();

@riverpod
Future<String?> userUid(Ref ref) async {
  var user = await ref.watch(authStateChangedProvider.future);
  return user?.uid;
}
```

When the auth state changes, the userUid is "reset" and returns values always in line with the current app state.

[source riverpod.dev](https://riverpod.dev/docs/root/faq#is-there-a-way-to-reset-all-providers-at-once)

## Tips

### Use `ref.select` to limit rebuilds

When a widget only needs one field of a larger provider, `ref.watch` on the whole object causes it to rebuild on every unrelated change.

```dart
// rebuilds on any User change (avatar, email, preferences...)
final name = ref.watch(userProvider).name;

// rebuilds only when name changes
final name = ref.watch(userProvider.select((u) => u.name));
```

This works for any provider type, including async ones:

```dart
final isAdmin = ref.watch(userProvider.select((u) => u.isAdmin));
```

__⚠️ The selector must return a value that is comparable with `==`. If it returns a new object each time (like a list copy), the optimization does nothing.__

### React without rebuilding — `ref.listen`

`ref.listen` is the right tool when you need to react to a state change but don't want to trigger a rebuild: SnackBars, navigation, dialogs.

But you can also use inside providers, `ref.listen` drives side effects when another provider changes — for example, clearing a search query when filters changes:

```dart
@riverpod
class Query extends _$Query {
  @override
  String build() {
    ref.listen(filtersProvider, (_, __) => state = "");
    return "";
  }

  void set(String query) => state = query;
}
```
