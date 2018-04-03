import pm from './playMiddleware.js';

/*
This feature makes sure the player is paused during ad loading.

It does this by pausing the player immediately after a "play" where ads will be requested,
then signalling that we should play after the ad is done.
*/

export default function cancelContentPlay(player) {
  if (pm.isMiddlewareMediatorSupported()) {
    // Don't use cancelContentPlay while playMiddleware is in use
    return;
  } else if (player.ads._shouldBlockPlay === false) {
    // Only block play if the ad plugin is in a state when content
    // playback should be blocked. This currently means during
    // BeforePrerollState and PrerollState.
    return;
  }

  player.ads.debug('Using cancelContentPlay to block content playback');

  // pause playback so ads can be handled.
  if (!player.paused()) {
    player.pause();
  }

  // When the 'content-playback' state is entered, this will let us know to play.
  // This is needed if there is no preroll or if it errors, times out, etc.
  player.ads._cancelledPlay = true;
}
