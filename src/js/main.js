import "./localStorage.js";
import search_terms from "../data/search-terms.js";

const BING_AUTOSEARCH = {
    elements: {
        button: {
            start: document.getElementById("btn-start"),
            stop: document.getElementById("btn-stop"),
            settings: document.getElementById("btn-settings"),
            warning: document.getElementById("btn-settings-warning"),
            divSettings: document.getElementById("div-settings"),
        },
        select: {
            limit: document.getElementById("slc-limit"),
            interval: document.getElementById("slc-interval"),
            multitab: document.getElementById("slc-multitab"),
        },
        span: {
            progress: document.getElementById("span-progress"),
        },
        div: {
            settings: document.getElementById("div-settings"),
            timer: document.getElementById("div-timer"),
            bing: document.getElementById("div-bing")
        }
    },
    cookies: {
        set: (name, value, expires) => {
            try {
                let d = new Date();
                d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000));
                let cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
                document.cookie = cookie;
            }
            catch (e) { }
        },
        get: (name) => {
            let value = null;
            try {
                let cookies = document.cookie.split(';');
                cookies.forEach((cookie) => {
                    if ((cookie + "=").trim().indexOf(name) == 0)
                        value = cookie.substring(name.length + 2, cookie.length);
                });
            }
            catch (e) { }
            return { name, value };
        },
        load: () => {
            let _need_help = BING_AUTOSEARCH.cookies.get("_need_help");
            let _multitab_mode = BING_AUTOSEARCH.cookies.get("_multitab_mode");
            let _search_interval = BING_AUTOSEARCH.cookies.get("_search_interval");
            let _search_limit = BING_AUTOSEARCH.cookies.get("_search_limit");

            if (!_need_help.value) {
                BING_AUTOSEARCH.cookies.set("_need_help", BING_AUTOSEARCH.search.multitab.toString(), 365);
            }

            if (!_search_interval.value) {
                BING_AUTOSEARCH.cookies.set("_search_interval", BING_AUTOSEARCH.search.interval.toString(), 365);
            }
            else {
                BING_AUTOSEARCH.elements.select.interval.value = BING_AUTOSEARCH.search.interval = parseInt(_search_interval.value.toString());
            }

            if (!_search_limit.value) {
                BING_AUTOSEARCH.cookies.set("_search_limit", BING_AUTOSEARCH.search.limit.toString(), 365);
            }
            else {
                BING_AUTOSEARCH.elements.select.limit.value = BING_AUTOSEARCH.search.limit = parseInt(_search_limit.value.toString());
            }

            if (!_multitab_mode.value) {
                (function (a) {
                    if ((/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))))
                        BING_AUTOSEARCH.elements.select.multitab.value = "true";
                })(navigator.userAgent || navigator.vendor || window.opera);
                BING_AUTOSEARCH.cookies.set("_multitab_mode", BING_AUTOSEARCH.elements.select.multitab.value, 365);
            }
            else {
                BING_AUTOSEARCH.elements.select.multitab.value = _multitab_mode.value;
                BING_AUTOSEARCH.search.multitab = (_multitab_mode.value === "true");
            }
        }
    },
    search: {
        limit: 35,
        interval: 10000,
        multitab: true,
        engine: {
            terms: {
                lists: [],
                random: () => {
                    let list = BING_AUTOSEARCH.search.engine.terms.lists[Math.floor(Math.random() * BING_AUTOSEARCH.search.engine.terms.lists.length)];
                    let term = list[Math.floor(Math.random() * list.length)];
                    return term;
                }
            },
            form: {
                params: [
                    "QBLH", "QBRE", "HDRSC1", "LGWQS1", "LGWQS2", "LGWQS3", "R5FD", "R5FD1", "R5FD2", "R5FD3", "R5FD4", "R5FD5", "R5FD6", "R5FD7", "QSRE1", "QSRE2", "QSRE3", "QSRE4", "QSRE5", "QSRE6", "QSRE7", "QSRE8"
                ],
                random: () => {
                    return BING_AUTOSEARCH.search.engine.form.params[Math.floor(Math.random() * BING_AUTOSEARCH.search.engine.form.params.length)]
                }
            },
            window: {
                open: (search) => {
                    try {
                        let w = window.open(search.url);
                        if (w) {
                            setTimeout(() => {
                                w.close();
                            }, (search.interval <= 10000 && BING_AUTOSEARCH.search.interval !== 9999 ? search.interval : 10000) - 500);
                        }
                    }
                    catch (e) { }
                }
            },
            iframe: {
                add: (search) => {
                    let iframe = document.createElement("iframe");
                    iframe.setAttribute("src", search.url);
                    iframe.setAttribute("title", search.term);
                    iframe.setAttribute("data-index", search.index);
                    if (BING_AUTOSEARCH.elements.div.bing.firstChild)
                        BING_AUTOSEARCH.elements.div.bing.removeChild(BING_AUTOSEARCH.elements.div.bing.firstChild);
                    BING_AUTOSEARCH.elements.div.bing.appendChild(iframe);
                }
            },
            settings: {
                toString: () => {
                    try {
                      let multitabText = "";
                      const isMultitab = BING_AUTOSEARCH.elements.select.multitab.options[BING_AUTOSEARCH.elements.select.multitab.selectedIndex].value
                      if(isMultitab == "true") {
                        multitabText = `<div class="px-2 badge">Multi-tab Mode</div>`;
                      }
                        return `<br>
                        <div class="gap-1 justify-center flex flex-wrap">
                        <div class="px-2 badge">${BING_AUTOSEARCH.elements.select.limit.options[BING_AUTOSEARCH.elements.select.limit.selectedIndex].text}</div><div class="px-2 badge">${BING_AUTOSEARCH.elements.select.interval.options[BING_AUTOSEARCH.elements.select.interval.selectedIndex].text} interval</div>
                         ${multitabText}
                        </div>`;
                    }
                    catch (e) {
                        return `Oops! There was an error loading the settings, please clear your browser cookies and reload the page to continue`;
                    }
                }
            },
            progress: {
                update: (search) => {
                    let progress = `(${search.index < 10 ? "0" + search.index : search.index}/${BING_AUTOSEARCH.search.limit < 10 ? "0" + BING_AUTOSEARCH.search.limit : BING_AUTOSEARCH.search.limit})`;
                    document.title = `${progress} - Bing Auto Search Running`;
                    BING_AUTOSEARCH.elements.span.progress.innerText = progress;
                }
            },
            timer: {
                next: null,
                complete: null,
                toClockFormat: (milliseconds, showHours = false) => {
                    let hrs = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
                    let min = Math.floor((milliseconds / 1000 / 60) % 60);
                    let sec = Math.floor((milliseconds / 1000) % 60);
                    return `${showHours ? String(hrs).padStart(2, '0') + ":" : ""}${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
                },
                updateEstimatedTime: (search) => {
                    let now = new Date();
                    let next = new Date(now.getTime() + BING_AUTOSEARCH.search.interval);
                    let complete = new Date(now.getTime() + (BING_AUTOSEARCH.search.interval * (BING_AUTOSEARCH.search.limit - search.index)));
                    if (search.index === BING_AUTOSEARCH.search.limit)
                        next = now;
                    BING_AUTOSEARCH.search.engine.timer.next = next;
                    BING_AUTOSEARCH.search.engine.timer.complete = complete;
                },
                run: () => {
                    let now = new Date();
                    let next = (BING_AUTOSEARCH.search.engine.timer.next - now);
                    let complete = (BING_AUTOSEARCH.search.engine.timer.complete - now);
                    if (BING_AUTOSEARCH.search.interval === 9999) {
                        BING_AUTOSEARCH.elements.div.timer.innerHTML = `<strong>Auto Search Running:</strong> 10~60 seconds (random) auto search interval active.`;
                    }
                    else if (complete >= 0) {
                        BING_AUTOSEARCH.elements.div.timer.innerHTML = `<strong>Auto Search Running:</strong> ${next >= 0 ? `New auto search in ${BING_AUTOSEARCH.search.engine.timer.toClockFormat(next)}` : "Finishing last auto search"}, estimated time to complete ${BING_AUTOSEARCH.search.engine.timer.toClockFormat(complete, true)}.`;
                        setTimeout(() => {
                            BING_AUTOSEARCH.search.engine.timer.run();
                        }, 1000);
                    }
                    else {
                        BING_AUTOSEARCH.elements.div.timer.innerHTML = `<strong>Auto Search Running:</strong> Stopping the auto search process...`;
                    }
                }
            }
        },
        generate: () => {
            let searches = new Array();
            let randomDelay = 0;
            do {
                let term = BING_AUTOSEARCH.search.engine.terms.random();
                if (!searches.includes(term)) {
                    let index = searches.length + 1;
                    let url = `https://www.bing.com/search?q=${encodeURIComponent(term.toLowerCase())}&FORM=${BING_AUTOSEARCH.search.engine.form.random()}`;
                    let delay = BING_AUTOSEARCH.search.interval * searches.length;
                    if (BING_AUTOSEARCH.search.interval === 9999 && searches.length > 0)
                        delay = randomDelay = ((Math.floor(Math.random() * 51) + 10) * 1000) + randomDelay;
                    searches.push({ term, url, index, delay });
                }
            } while (searches.length < BING_AUTOSEARCH.search.limit)
            return searches;
        },
        start: () => {
            let searches = BING_AUTOSEARCH.search.generate();
            searches.forEach((search) => {
                setTimeout(() => {
                    BING_AUTOSEARCH.search.engine.progress.update(search);
                    BING_AUTOSEARCH.search.engine.timer.updateEstimatedTime(search);
                    if (search.index === BING_AUTOSEARCH.search.limit) {
                        setTimeout(() => {
                            BING_AUTOSEARCH.search.stop();
                        }, (search.interval <= 10000 && BING_AUTOSEARCH.search.interval !== 9999 ? search.interval : 10000));
                    }
                    if (search.delay === 0)
                        BING_AUTOSEARCH.search.engine.timer.run();
                    if (!BING_AUTOSEARCH.search.multitab)
                        BING_AUTOSEARCH.search.engine.iframe.add(search);
                    else
                        BING_AUTOSEARCH.search.engine.window.open(search);
                }, search.delay);
            });
        },
        stop: () => {
            window.open("https://rewards.bing.com/pointsbreakdown");
            location.reload();
        }
    },
    load: async () => {
        BING_AUTOSEARCH.cookies.load();
        try {
            const data = search_terms();
            BING_AUTOSEARCH.search.engine.terms.lists = Object.values(data);
        } catch (error) {
            console.error('Failed to load search terms:', error);
        }

        BING_AUTOSEARCH.elements.button.start.addEventListener("click", () => {
            BING_AUTOSEARCH.elements.button.start.style.display = "none";
            BING_AUTOSEARCH.elements.button.settings.style.display = "none";
            BING_AUTOSEARCH.elements.button.warning.style.display = "none";
            BING_AUTOSEARCH.elements.button.divSettings.style.display = "none";
            BING_AUTOSEARCH.elements.button.stop.style.display = "inline-block";
            BING_AUTOSEARCH.search.start();
        });

        BING_AUTOSEARCH.elements.button.stop.addEventListener("click", () => {
            BING_AUTOSEARCH.search.stop();
        });

        BING_AUTOSEARCH.elements.select.multitab.addEventListener("change", () => {
            BING_AUTOSEARCH.cookies.set("_multitab_mode", BING_AUTOSEARCH.elements.select.multitab.value, 365);
            location.reload();
        });

        BING_AUTOSEARCH.elements.select.limit.addEventListener("change", () => {
            BING_AUTOSEARCH.cookies.set("_search_limit", BING_AUTOSEARCH.elements.select.limit.value, 365);
            location.reload();
        });

        BING_AUTOSEARCH.elements.select.interval.addEventListener("change", () => {
            BING_AUTOSEARCH.cookies.set("_search_interval", BING_AUTOSEARCH.elements.select.interval.value, 365);
            location.reload();
        });

        BING_AUTOSEARCH.elements.div.settings.innerHTML = `${BING_AUTOSEARCH.search.engine.settings.toString().replace(/\([^)]*\)/g, "")}`;
    }
};

window.addEventListener("load", async () => {
    await BING_AUTOSEARCH.load();
});
