//@ts-check
// Паралельные вычисления
function parallel(funcs, callback) {

    // просто счетчик того что у нас остались не завершенные задания
    let _waitings = 0;
    let _pendings = [];

    const resolve = (index) => {
        return (result) => {
            --_waitings;
            _pendings[index] = result;

            if (_waitings === 0) {
                callback(_pendings);
            }
        }
    };

    _pendings = funcs.map((fn, i) => {
        const value = fn.bind(null, resolve(i))();

        if (value === undefined) {
            ++_waitings;
        }

        return value;
    });

    if (_waitings === 0) {
        callback(_pendings);
    }
}



// #region [ test 1 ]
parallel([
    function (resolve) {
        setTimeout(function () {
            resolve(10)
        }, 50);
    },
    function () {
        return 5;
    },
    function (resolve) {
        setTimeout(function () {
            resolve(0)
        }, 10);
    }
], function (results) {
    console.log(results);
});
// #endregion
