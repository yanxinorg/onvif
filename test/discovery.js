// Generated by CoffeeScript 1.9.2
(function() {
  var assert, onvif, serverMockup;

  assert = require('assert');

  onvif = require('../lib/onvif');

  serverMockup = require('./serverMockup');

  describe('Discovery', function() {
    this.timeout(10000);
    it('should discover at least one device (mockup server)', function(done) {
      return onvif.Discovery.probe({
        timeout: 1000
      }, function(err, cams) {
        assert.equal(err, null);
        assert.ok(cams.length > 0);
        assert.ok(cams[0] instanceof onvif.Cam);
        return done();
      });
    });
    it('should discover at least one device with defaults and callback', function(done) {
      return onvif.Discovery.probe(function(err, cams) {
        assert.equal(err, null);
        assert.ok(cams.length > 0);
        assert.ok(cams[0] instanceof onvif.Cam);
        return done();
      });
    });
    it('should work as event emitter (also test `probe` without params)', function(done) {
      onvif.Discovery.once('device', function(cam) {
        assert.ok(cam);
        assert.ok(cam instanceof onvif.Cam);
        return done();
      });
      return onvif.Discovery.probe();
    });
    it('should return info object instead of Cam object when `resolve` is false', function(done) {
      onvif.Discovery.once('device', function(cam) {
        assert.ok(cam);
        assert.equal(cam instanceof onvif.Cam, false);
        return done();
      });
      return onvif.Discovery.probe({
        resolve: false
      });
    });
    it('should emit and error and return error in callback when response is wrong', function(done) {
      var emit;
      emit = false;
      onvif.Discovery.once('error', function(err, xml) {
        assert.equal(xml, 'lollipop');
        assert.equal(err.indexOf('Wrong SOAP message'), 0);
        return emit = true;
      });
      return onvif.Discovery.probe({
        timeout: 1000,
        messageId: 'e7707'
      }, function(err, cams) {
        assert.notEqual(err, null);
        assert.ok(emit);
        return done();
      });
    });
    return it('should got single device for one probe', function(done) {
      var cams, onCam;
      cams = {};
      onCam = function(data) {
        if (cams[data.probeMatches.probeMatch.XAddrs]) {
          return assert.fail();
        } else {
          return cams[data.probeMatches.probeMatch.XAddrs] = true;
        }
      };
      onvif.Discovery.on('device', onCam);
      return onvif.Discovery.probe({
        timeout: 1000,
        resolve: false,
        messageId: 'd0-61e'
      }, function(err, cCams) {
        assert.equal(err, null);
        assert.equal(Object.keys(cams).length, cCams.length);
        onvif.Discovery.removeListener('device', onCam);
        return done();
      });
    });
  });

}).call(this);

//# sourceMappingURL=discovery.js.map
