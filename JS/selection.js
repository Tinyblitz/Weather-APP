function selection() {

    const selectionTemp = document.getElementById('selection-temp');
    const humidityStat = document.querySelector('#stat-humidity .selection-stat-text');
    const precipprobStat = document.querySelector('#stat-precipprob .selection-stat-text');
    const windspeedStat = document.querySelector('#stat-windspeed .selection-stat-text');
    const uvindexStat = document.querySelector('#stat-uvindex .selection-stat-text');
    
    return {
        updateByLocation: function () {

        },
        updateByDay: function () {

        },
        updateByHour: function () {

        }
    };
}

export default selection();