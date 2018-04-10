import videojs from 'video.js';
import '../../examples/basic-ad-plugin/example-integration.js';

QUnit.module('Integration: play middleware', {
  beforeEach: function() {
    this.video = document.createElement('video');

    this.fixture = document.querySelector('#qunit-fixture');
    this.fixture.appendChild(this.video);

    // this.sandbox = sinon.sandbox.create();
    // this.clock = sinon.useFakeTimers();

    this.player = videojs(this.video);

    this.player.exampleAds({
      'adServerUrl': '/base/test/integration/lib/inventory.json'
    });
  },

  afterEach: function() {
    // this.clock.restore();
    // this.sandbox.restore();
    this.player.dispose();
  }
});

QUnit.test('the `_playRequested` flag is set on the first play request', function(assert) {
  const done = assert.async();

  this.player.src({
    src: 'http://vjs.zencdn.net/v/oceans.webm',
    type: 'video/webm'
  });

  // When the preroll starts
  this.player.on('adstart', () => {
    assert.strictEqual(this.player.ads._playRequested, true,
    '_playRequested is true when the play method is used');
    done();
  });

  // If there wasn't an ad
  this.player.on('timeupdate', () => {
    if (this.player.currentTime() > 0) {
      assert.strictEqual(this.player.ads._playRequested, true,
      '_playRequested is true when the play method is used');
      done();
    }
  });

  this.player.ready(this.player.play);
});

QUnit.test('blocks calls to play to wait for prerolls when the plugin loads BEFORE play', function(assert) {
  const done = assert.async();
  const techPlaySpy = sinon.spy(this.video, 'play');
  const playEventSpy = sinon.spy();
  let seenAdsReady = false;

  this.player.on('play', playEventSpy);
  this.player.on('adsready', () => {
    seenAdsReady = true;
  });

  // When the preroll starts
  this.player.on('adstart', () => {
    assert.strictEqual(techPlaySpy.callCount, 0,
      "tech play shouldn't be called while waiting for prerolls");
    assert.strictEqual(playEventSpy.callCount, 1,
      'play event should be triggered');
    done();
  });

  // If there wasn't an ad
  this.player.on('timeupdate', () => {
    if (this.player.currentTime() > 0) {
      assert.strictEqual(techPlaySpy.callCount, 0,
        "tech play shouldn't be called while waiting for prerolls");
      assert.strictEqual(playEventSpy.callCount, 1,
        'play event should be triggered');
      done();
    }
  });

  this.player.src({
    src: 'http://vjs.zencdn.net/v/oceans.webm',
    type: 'video/webm'
  });

  this.player.ready(() => {
    if (seenAdsReady) {
      this.player.play();

    } else {
      this.player.on('adsready', this.player.play);
    }
  });
});

// QUnit.test('blocks calls to play to wait for prerolls when the plugin loads AFTER play', function(assert) {

// });