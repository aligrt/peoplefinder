(function ($, pf, L) {
    pf.modules.circlesObserver = {};
    $.extend(pf.modules.circlesObserver, {

        _circles: null,

        init: function () {
            pf.viewmodel.trackingActive = false;
            this.bindEvents();
        },

        bindEvents: function () {
            var context = this;

            pf.subscriber.subscribe('observer/tracking/toggle', function () {
                pf.viewmodel.trackingActive = !pf.viewmodel.trackingActive;
                if (pf.viewmodel.trackingActive) {
                    pf.modules.circlesLayer.clearAll();
                    context.updateCircles();
                }
            }, this);
        },

        updateCircles: function (timestampBegin) {
            if (!pf.viewmodel.trackingActive) return false;

            this._timestamp_end = new Date().getTime();

            var context = this,
                selectedImsi = pf.viewmodel.selectedImsi,
                params = {
                    timestamp_end: this._timestamp_end
                };

            if (timestampBegin) {
                params['timestamp_begin'] = timestampBegin;
            }

            $.ajax({
                url: pf.settings.root_url + '/imsi/' + selectedImsi +'/circles',
                data: params,
                dataType: 'json'
            }).done(function (result) {
                pf.modules.circlesLayer.addCircles(result.circles);
                setTimeout(function () {
                    if (selectedImsi === pf.viewmodel.selectedImsi) {
                        context.updateCircles(context._timestamp_end);
                    }
                }, pf.settings.tracking_timeout);
            });
        }
    });
}(jQuery, pf, L));