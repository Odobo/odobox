/**
 * Created by petermares on 27/04/2016.
 */

module.exports = TimerControl;

function TimerControl() {
    this.timers = {};
}

TimerControl.prototype.startTimer = function(id, timeout, cb, context) {
    var timerFn = context ? vertx.setTimer.bind(context) : vertx.setTimer;

    this.timers[id] = {
        id: id,
        cb: cb,
        timerID: timerFn(timeout, function(tID) {
            if ( cb ) {
                var o = this.timers[id];
                o.reason = 'timeout';
                delete this.timers[id];
                cb(o);
            }
        })
    }
};

TimerControl.prototype.cancelTimer = function(id) {
    if ( this.timers[id] ) {
        var o = this.timers[id];

        vertx.cancelTimer(o.timerID);
        delete this.timers[id];
        o.reason = 'cancelled';
        o.cb(o);
    }
}