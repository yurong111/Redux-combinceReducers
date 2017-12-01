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
