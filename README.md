# Redux-combinceReducers

```
//源码核心部分
function combineReducers(reducers) {

  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  return function combination(state = {}, action) {
    console.log('state:', state, 'action:', action);

    let hasChanged = false
    const nextState = {}

    for (let i = 0; i < finalReducerKeys.length; i++) {//所有的reducer都会被执行一遍，判读改变过的就更新state

      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      console.log('key', key)

      const previousStateForKey = state[key]

      console.log('reducer:', reducer, 'action', action)

      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey	//新数据和旧数据进行比较，但是两个对象的比较貌似没有意义吧，永远也是true，最后还是“新”值替换旧值，只是这个新值不变
      console.log('hasChanged', hasChanged, 'nextStateForKey', nextStateForKey, 'previousStateForKey', previousStateForKey)
    }
    return hasChanged ? nextState : state
  }
}
```

模拟调用：

```
//模拟reducer数据
function reducer1(state = 0, action){

    switch (action.type) {
        case 'SEARCH_PENDING':
            return Object.assign({}, state, {
                SEARCH: null,
                searchResult: null
            })
            break;
        case 'SEARCH_SUCCESS':

            return Object.assign({}, state, {
                SEARCH: null,
                searchResult: 'success1'
            })
            break;
        case 'SEARCH_ERROR':
            return Object.assign({}, state, {
                SEARCH: false,
                searchResult: 'error1'
            })
            break;

        default:
            return Object.assign({}, state, {
            })
    }
}
//模拟reducer数据
function reducer2(state = 0, action){

    switch (action.type) {
        case 'SEARCH_PENDING':
            return Object.assign({}, state, {
                SEARCH: null,
                searchResult: null
            })
            break;
        case 'SEARCH_SUCCESS':

            return Object.assign({}, state, {
                SEARCH: null,
                searchResult: 'success2'
            })
            break;
        case 'SEARCH_ERROR':
            return Object.assign({}, state, {
                SEARCH: false,
                searchResult: 'error2'
            })
            break;

        default:
            return Object.assign({}, state, {
            })
    }
}


var res = combineReducers({
  reducer1,
  reducer2
});

var newState = res({reducer1:{num: 1}}, {type:'SEARCH_SUCCESS'})
console.log('newState', newState)
```

打印结果：

```
state: {reducer1: {…}} action: {type: "SEARCH_SUCCESS"}
key reducer1
reducer: ƒ reducer1() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var action = arguments[1];


    switch (action.type) {
        case 'SEARCH_PENDING':
       … action {type: "SEARCH_SUCCESS"}
hasChanged true nextStateForKey {num: 1, SEARCH: null, searchResult: "success1"} previousStateForKey {num: 1}
key reducer2
reducer: ƒ reducer2() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var action = arguments[1];


    switch (action.type) {
        case 'SEARCH_PENDING':
       … action {type: "SEARCH_SUCCESS"}
hasChanged true nextStateForKey {SEARCH: null, searchResult: "success2"} previousStateForKey undefined
newState {reducer1: {…}, reducer2: {…}}
```

在调用的时候，模拟调用res({reducer1:{num: 1}}, {type:'SEARCH_SUCCESS'})；res是combineReducers的返回值，该值是一个函数，这里combineReducers返回函数把它叫res，res函数的执行是在createStore.js源码中的dispatch方法中调用的，就是说当我们调用dispatch(action)的时候会调用res。res接收两个参数，一个是当前的state，一个是action。

combineReducers的返回函数中有一个for循环，由于在调用combineReducers，传过去的是一个key/value对象。而combineReducers 将所有的key分离出来，在for循环里将所有的reducer都执行一遍，根据返回来的值和旧的数据值作判断，改变过就更新返回。而返回值也是在createStore.js源码中作赋值操作。

```
for (let i = 0; i < finalReducerKeys.length; i++) {//...}
```

 ## 疑问

不明白为什么要在源码中最后对新旧值作判断
hasChanged = hasChanged || nextStateForKey !== previousStateForKey，因为个人理解两个对象的判断永远也会是true的，最后返回的都是最新的值，不管是否修改过。
