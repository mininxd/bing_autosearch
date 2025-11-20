/**
 * Module for handling cookies
 */

export const cookieHandler = {
  set: (name, value, expires) => {
    try {
      // If value is an array, serialize it as JSON
      let serializedValue = Array.isArray(value) ? JSON.stringify(value) : value;
      let d = new Date();
      d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000));
      let cookie = `${name}=${serializedValue};expires=${d.toUTCString()};path=/`;
      document.cookie = cookie;
    } catch (e) {
      console.warn('Error setting cookie:', e);
    }
  },

  get: (name) => {
    let value = null;
    try {
      let cookies = document.cookie.split(';');
      cookies.forEach((cookie) => {
        if ((cookie + "=").trim().indexOf(name) == 0) {
          value = cookie.substring(name.length + 2, cookie.length);

          // Try to parse as JSON if it looks like an array
          try {
            if (value && (value.startsWith('[') && value.endsWith(']'))) {
              value = JSON.parse(value);
            }
          } catch (e) {
            // If parsing fails, leave value as string
          }
        }
      });
    } catch (e) {
      console.warn('Error getting cookie:', e);
    }
    return { name, value };
  },

  load: (defaultConfig) => {
    const _need_help = cookieHandler.get("_need_help");
    const _multitab_mode = cookieHandler.get("_multitab_mode");
    const _search_interval = cookieHandler.get("_search_interval");
    const _search_limit = cookieHandler.get("_search_limit");
    const _wakelock_enabled = cookieHandler.get("_wakelock_enabled");
    const _sequential_enabled = cookieHandler.get("_sequential_enabled");
    const _search_categories = cookieHandler.get("_search_categories");

    let config = { ...defaultConfig };

    if (!_need_help.value) {
      cookieHandler.set("_need_help", (config.multitab !== undefined ? config.multitab : defaultConfig.multitab).toString(), 365);
    }

    if (!_search_interval.value) {
      cookieHandler.set("_search_interval", (config.interval !== undefined ? config.interval : defaultConfig.interval).toString(), 365);
    } else {
      config.interval = parseInt(_search_interval.value || config.interval);
    }

    if (!_search_limit.value) {
      cookieHandler.set("_search_limit", (config.limit !== undefined ? config.limit : defaultConfig.limit).toString(), 365);
    } else {
      config.limit = parseInt(_search_limit.value || config.limit);
    }

    if (!_multitab_mode.value) {
      (function (a) {
        if ((/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))))
          config.multitab = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      cookieHandler.set("_multitab_mode", (config.multitab !== undefined ? config.multitab : defaultConfig.multitab).toString(), 365);
    } else {
      config.multitab = (_multitab_mode.value === "true");
    }

    if (!_wakelock_enabled.value) {
      cookieHandler.set("_wakelock_enabled", (config.wakelock !== undefined ? config.wakelock : defaultConfig.wakelock).toString(), 365);
    } else {
      config.wakelock = (_wakelock_enabled.value === "true");
    }

    if (!_sequential_enabled.value) {
      cookieHandler.set("_sequential_enabled", (config.sequential !== undefined ? config.sequential : defaultConfig.sequential).toString(), 365);
    } else {
      config.sequential = (_sequential_enabled.value === "true");
    }

    // Handle categories
    if (!_search_categories.value) {
      cookieHandler.set("_search_categories", config.categories || ["games", "cars", "songs", "artists", "characters", "movies"], 365);
    } else if (Array.isArray(_search_categories.value)) {
      config.categories = _search_categories.value;
    }

    return config;
  }
};