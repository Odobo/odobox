/**
 * Created by petermares on 16/11/2015.
 */
module.exports = function DateX(_date) {
    var d = _date ? _date : new Date();
    var minuteMS = 60*1000;
    var hourMS = minuteMS * 60;
    var dayMS = hourMS * 24;
    var weekMS = dayMS * 7;

    this.timestamp = function() {
        return d.getTime();
    };

    this.justDate = function() {
        return new DateX(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
    };

    /**
     * Increment the current object by a certain value in a specific resolution
     * @param num
     * @param resolution Can be 'seconds, minutes, hours, days, weeks'
     * @returns {DateX}
     */
    this.add = function(num, resolution) {
        var diff;

        switch ( resolution ) {
            case	'seconds':
                diff = num * 1000;
                break;

            case 'minutes':
                diff = num * minuteMS;
                break;

            case 'hours':
                diff = num * hourMS;
                break;

            case 'days':
                diff = num * dayMS;
                break;

            case 'weeks':
                diff = num * weekMS;
                break;

            default:
                throw 'DateX Exception: Unknown time resolution: ' + resolution;
        }

        return new DateX(new Date(d.getTime() + diff));
    };

    this.subtract = function(num, resolution) {
        return this.add(-num, resolution);
    }

    this.daysFrom = function(dayName) {
        var dayIndex, result = -1;
        var days =['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        if ( typeof dayName == 'string' ) {
            dayIndex = days.indexOf(dayName);
            if ( dayIndex != -1 ) {
                result = d.getDay()-dayIndex;
            }
        }

        return result;
    };

    this.rawDate = function() {
        return d;
    };

    this.toString = function() {
        return d.toString();
    }
};
