(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8055],{8018:function(e,t,a){var n,s=Object.create,l=Object.defineProperty,o=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,r=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty,h=(e,t,a,n)=>{if(t&&"object"===typeof t||"function"===typeof t)for(let s of i(t))p.call(e,s)||s===a||l(e,s,{get:()=>t[s],enumerable:!(n=o(t,s))||n.enumerable});return e},u=(e,t,a)=>(((e,t,a)=>{t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a})(e,"symbol"!==typeof t?t+"":t,a),a),y={};((e,t)=>{for(var a in t)l(e,a,{get:t[a],enumerable:!0})})(y,{default:()=>P}),e.exports=(n=y,h(l({},"__esModule",{value:!0}),n));var c=((e,t,a)=>(a=null!=e?s(r(e)):{},h(!t&&e&&e.__esModule?a:l(a,"default",{value:e,enumerable:!0}),e)))(a(67294)),d=a(38045),b=a(71776);class P extends c.Component{constructor(){super(...arguments),u(this,"callPlayer",d.callPlayer),u(this,"playerID",this.props.config.playerId||`wistia-player-${(0,d.randomString)()}`),u(this,"onPlay",((...e)=>this.props.onPlay(...e))),u(this,"onPause",((...e)=>this.props.onPause(...e))),u(this,"onSeek",((...e)=>this.props.onSeek(...e))),u(this,"onEnded",((...e)=>this.props.onEnded(...e))),u(this,"onPlaybackRateChange",((...e)=>this.props.onPlaybackRateChange(...e))),u(this,"mute",(()=>{this.callPlayer("mute")})),u(this,"unmute",(()=>{this.callPlayer("unmute")}))}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e){const{playing:t,muted:a,controls:n,onReady:s,config:l,onError:o}=this.props;(0,d.getSDK)("https://fast.wistia.com/assets/external/E-v1.js","Wistia").then((e=>{l.customControls&&l.customControls.forEach((t=>e.defineControl(t))),window._wq=window._wq||[],window._wq.push({id:this.playerID,options:{autoPlay:t,silentAutoPlay:"allow",muted:a,controlsVisibleOnLoad:n,fullscreenButton:n,playbar:n,playbackRateControl:n,qualityControl:n,volumeControl:n,settingsControl:n,smallPlayButton:n,...l.options},onReady:e=>{this.player=e,this.unbind(),this.player.bind("play",this.onPlay),this.player.bind("pause",this.onPause),this.player.bind("seek",this.onSeek),this.player.bind("end",this.onEnded),this.player.bind("playbackratechange",this.onPlaybackRateChange),s()}})}),o)}unbind(){this.player.unbind("play",this.onPlay),this.player.unbind("pause",this.onPause),this.player.unbind("seek",this.onSeek),this.player.unbind("end",this.onEnded),this.player.unbind("playbackratechange",this.onPlaybackRateChange)}play(){this.callPlayer("play")}pause(){this.callPlayer("pause")}stop(){this.unbind(),this.callPlayer("remove")}seekTo(e,t=!0){this.callPlayer("time",e),t||this.pause()}setVolume(e){this.callPlayer("volume",e)}setPlaybackRate(e){this.callPlayer("playbackRate",e)}getDuration(){return this.callPlayer("duration")}getCurrentTime(){return this.callPlayer("time")}getSecondsLoaded(){return null}render(){const{url:e}=this.props,t=e&&e.match(b.MATCH_URL_WISTIA)[1],a=`wistia_embed wistia_async_${t}`;return c.default.createElement("div",{id:this.playerID,key:t,className:a,style:{width:"100%",height:"100%"}})}}u(P,"displayName","Wistia"),u(P,"canPlay",b.canPlay.wistia),u(P,"loopOnEnded",!0)}}]);