/*

 The MIT License (MIT)
 Copyright (c) 2016 Odobo Limited

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in the
 Software without restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the
 following conditions:

 The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.

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
