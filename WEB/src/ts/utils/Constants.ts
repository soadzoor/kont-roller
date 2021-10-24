import {BrowserUtils} from "./BrowserUtils";

export class Constants
{
	public static readonly API_HOST = BrowserUtils.siteUrl;

	public static readonly PLACEHOLDER_EMAIL = "jane@example.com";
	public static readonly AUTH_TOKEN = "authenticationToken";

	public static readonly SNACKBAR_AUTOHIDE_DURATION = 6000;

	public static readonly TRANSITION_DURATION = 400;
	public static readonly ANIMATION_DURATION = 2000;
	public static readonly FOV = 75;
	public static readonly POINTER_SENSITIVITY = 1.2;

	public static readonly MIN_ZOOM_FACTOR = 1;

	public static readonly WORLD_UP = [0, 1, 0];
	public static readonly CAMERA_POSITION = [0, 0, 0];

	// radian / millisec. Multiply by deltaframe to get the actual radian you need to change per frame
	public static readonly AUTOROTATION_SPEEDS = {
		default: 0.00003,
		fast: 0.0009
	};

	public static get DEFAULT_ZOOM_FACTOR()
	{
		return window.innerWidth < 576 ? Constants.MIN_ZOOM_FACTOR : 1.2;
	};

	public static readonly MOUSE_BUTTON = {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2
	};

	public static get isFullscreenAvailable(): boolean
	{
		const targetElement = document.body as any;

		return !!targetElement.requestFullscreen ||
			   !!targetElement.webkitRequestFullscreen ||
			   !!targetElement.mozRequestFullScreen ||
			   !!targetElement.msRequestFullscreen;
	}

	public static readonly clickThreshold = {
		movement: 3, // in px. If the pointer moves more than this between "down" and "up", we assume it's not a "click"
		time: 1000, // in ms. If the elapsed time between "down" and "up" is more than this, we assume it's not a "click"
		longTap: 1000 // in ms
	};

	public static get isIOS()
	{
		return [
			"iPad Simulator",
			"iPhone Simulator",
			"iPod Simulator",
			"iPad",
			"iPhone",
			"iPod"
		].includes(navigator.platform)
			// iPad on iOS 13 detection
			|| (navigator.userAgent.includes("Mac") && "ontouchend" in document);
	}

	public static get isMac()
	{
		return /Mac/.test(navigator.userAgent) && !window.MSStream;
	}

	public static get browserName()
	{
		if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf("OPR")) != -1)
		{
			return "Opera";
		}
		else if (navigator.userAgent.indexOf("Chrome") != -1)
		{
			if (navigator.platform.indexOf("Mac") > -1)
			{
				return "Chrome - Mac";
			}
			else
			{
				return "Chrome";
			}
		}
		else if (navigator.userAgent.indexOf("Safari") != -1)
		{
			return "Safari";
		}
		else if (navigator.userAgent.indexOf("Firefox") != -1)
		{
			return "Firefox";
		}
		else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!(<any>document).documentMode == true))
		{  //IF IE > 10
			return "IE";
		}
	}
}