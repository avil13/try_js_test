//@ts-check
// Паралельные вычисления реализация с WebWorker
function parallel(funcs, callback) {

    if (typeof Worker === 'undefined') {
        throw new Error('Worker not exists')
    }

    // просто счетчик того что у нас остались не завершенные задания
    let _waitings = 0;
    let _pendings = new Array(funcs.length);

    // функция для расчетов в паралельном потоке
    const wrapper = (func, index) => {
        ++_waitings;
        const strFn = func.toString();

        const _fn = function (fnInWorker) {
            const value = fnInWorker.bind(null, postMessage)();

            if (value !== undefined) {
                // @ts-ignore
                postMessage(value);
            }
        };

        // Отправляем функцию выполняться в паралельный поток в WebWorker
        const worker = new Worker(URL.createObjectURL(new Blob([`(${_fn})(${strFn})`])));

        worker.onmessage = (event) => {
            const result = event.data;

            --_waitings;
            _pendings[index] = result;

            if (_waitings === 0) {
                callback(_pendings);
            }
        };
    };

    funcs.forEach((fn, i) => {
        wrapper(fn, i);
    });
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
