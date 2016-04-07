(function() {
    function putLink(href, id, media) {
        var s = document.createElement('link');

        if(href.substring(0, 4)!="http"){
            href = jsApiModule.base_path+href;
        }

        s.type = 'text/css';
        s.rel = 'stylesheet';
        s.href = href;
        s.media = "none";
        s.setAttribute("id", id);
        document.head.appendChild(s);
        s.addEventListener('load', function(e) {
            setTimeout(function() {
                s.media = media || "all";
            });
        }, false);
        s.addEventListener('error', function(e) {
            
            console.error('error al cargar el link  ' + href);
        }, false);
    }

    function printLink(cacheCss, id) {
        var s = document.createElement('style');
        s.type = 'text/css';
        s.setAttribute("id", id);
        s.innerHTML = cacheCss;
        document.head.appendChild(s);
    }

    function putScript(src, id, callback) {
        var s = document.createElement('script');
        //jsApiModule.base_path
        if(src.substring(0, 4)!="http"){
            src = jsApiModule.base_path+src;
        }
        s.src = src;
        s.type = "text/javascript";
        s.async = true;
        s.setAttribute("id", id);
        document.body.appendChild(s);
        s.addEventListener('load', function(e) {
            callback();
        }, false);
        s.addEventListener('error', function(e) {
            
            console.error('error al cargar el script ' + src);
        }, false);
    }

    function loadScript() {
        putScript(jsApiModule.script[0].src, jsApiModule.script[0].id, function() {
            jsApiModule.script.splice(0, 1);
            validateJsApi();
        });
    }

    function loadLinkServer() {


        for (var i = 0; i < jsApiModule.linkServer.length; i++) {
            putLink(jsApiModule.linkServer[i].href, jsApiModule.linkServer[i].id);
        };



    }

    function loadLink() {



        //solo carga 
        if (jsApiModule.cache === true) {
            // solo carga los archivos que ya fueron guardados
            var version = jsApiModule.version || '1';
            for (var i = 0; i < jsApiModule.link.length; i++) {
                var id = 'jgt' + version + '-' + jsApiModule.link[i].id;
                //console.log('id de jsapi')
                //console.log(id);
                if (localStorage[id]) {
                    //console.log('pintando de jsapi')
                    printLink(localStorage[id], id);
                }
            };
        } else {
            for (var i = 0; i < jsApiModule.link.length; i++) {
                putLink(jsApiModule.link[i].href, jsApiModule.link[i].id);
            };
        }
    }

    function validateJsApi() {

        if (jsApiModule.script.length == 0) {
            if (typeof jsApiModule.onLoad === "function") {
                jsApiModule.onLoad();
            }
        } else {
            loadScript();
        }
    }

    if (typeof jsApiModule !== "undefined") {
        jsApiModule.cache = jsApiModule.cache || false;
        jsApiModule.base_path = jsApiModule.base_path || "";
        if (typeof jsApiModule.linkServer !== "undefined") {
            loadLinkServer();
        }
        if (typeof jsApiModule.link !== "undefined") {
            loadLink();
        }
        if (typeof jsApiModule.script !== "undefined") {
            validateJsApi();
        }
    }

})();