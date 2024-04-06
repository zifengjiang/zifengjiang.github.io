


(function($) {
    var needMarkmap = false;

if ($('.markmap').length > 0) {
        needMarkmap = true;
    };
const { markmap } = window;
    if(needMarkmap) {
        markmap.autoLoader.renderAll();
    }

})(jQuery);



;
(function($) {
    var needMermaid = false;

if ($('.mermaid').length > 0) {
        needMermaid = true;
    };
if (!needMermaid)  {
        mermaid.initialize({startOnLoad: false});
        return;
    }

    var params = {"enable":true,"flowchart":{"diagrampadding":20},"theme":"default"};

    // site params are stored with lowercase keys; lookup correct casing
    // from Mermaid default config.
    var norm = function(defaultConfig, params) {
        var result = {};
        for (const key in defaultConfig) {
            const keyLower = key.toLowerCase();
            if (defaultConfig.hasOwnProperty(key) && params.hasOwnProperty(keyLower)) {
                if (typeof defaultConfig[key] === "object") {
                    result[key] = norm(defaultConfig[key], params[keyLower]);
                } else {
                    result[key] = params[keyLower];
                }
            }
        }
        return result;
    };
    var settings = norm(mermaid.mermaidAPI.defaultConfig, params);
    settings.startOnLoad = true;
    mermaid.initialize(settings);
})(jQuery);
