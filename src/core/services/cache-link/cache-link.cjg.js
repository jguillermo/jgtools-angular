(function() {
    'use strict';
    angular
        .module('jgTools.core.services.cache-link', []);
})();
(function() {
    'use strict';

    function jgsCacheLinkServices($http, $q) {

        /**
         * se van a borrar todos los recursos que no esten en lalista, 
         * esto se hace para borrar archivos antiguos 
         * @param  {array} resourcesCache lista de md5 que son los nombre de los archivos de este
         * @return {bool}                true
         */
        this.deleteOldVersion = function(currentVersion) {


            //var id =  'jgt'+version+'-'+jgsHashServices.md5(href); //"id-contenedor1";

            var t = localStorage.length,
                i;
            var lsclear = [];
            for (i = 0; i < t; i++) {
                var key = localStorage.key(i);
                //console.log('key.substring(0, 3)')
                //console.log(key.substring(0, 3));
                if (key.substring(0, 3) === 'jgt') {
                    var guion = key.indexOf('-');
                    //console.log('guion');
                    //console.log(guion);
                    if (guion !== -1) {
                        
                        //console.log('key.substring(3, guion)')
                        //console.log(key.substring(3, guion));
                        if (key.substring(3, guion) !== currentVersion) {
                            lsclear.push(key);
                        }
                    }
                    
                }
            }

            //console.log('lsclear');
            //console.log(lsclear);
            t = lsclear.length;

            for (i = 0; i < t; i++) {
                localStorage.removeItem(lsclear[i]);
            }
            return true;
        };

        this.saveLink = function(href, name) {

            var defered = $q.defer();


            //console.log('guardando : ' + href);

            var rutaAbs = href.substring(0, href.lastIndexOf("/"));

            //console.log('ruta absoluta : ' + rutaAbs);

            $http.post(href).then(
                function(rpta) {

                    // en esta primer alfa solo se va a remplazar el ../ por rutaAbs/../
                    // se debe mejorar esta funcion ya que no todos cumplen esta condicion
                    //console.log(rpta.data);
                    var newcss = rpta.data.replace(/\.\.\//g, rutaAbs + '/../');
                    //console.log(newcss);



                    localStorage.setItem(name, newcss);
                    defered.resolve({
                        css: newcss
                    });
                    //console.log('saving : ' + href + ' as ' + name);

                    //"../fonts"

                    // trabajr mas en este script lo dejo por ahora
                    //console.log(rpta.data);
                    // mejorar la url (
                    //var css = rpta.data.replace(/url \(/g, "url(");
                    //console.log(css);
                    //var i = 0;
                    //do {
                    //    i = css.indexOf("url(", i);
                    //    if (i !== -1) {
                    //        var iend=css.indexOf(")", i);
                    //        if(iend!==-1) {
                    //            var urlstr = css.substring((i+4), iend);
                    //            console.log(urlstr);
                    //        }
                    //       i+=4; 
                    //    }
                    //    
                    //}
                    //while (i !== -1);
                    // se debe preguntar si el contenido de la url es de tipo url 
                    // si lo que esta dentro de un url() es una ruta :
                    // absoluta
                    // relativa
                    // es una cadena de texto base64
                    // se debe obtener la ruta exacta del script, si es local, se debe tomar la ruta del servidor
                    // remplazar todos los campos con la ruta absoluta del servidor 
                    //console.log(rpta);
                    //var newcss = css.replace(/\.\.\//g, jj.url("f_web/"));
                },
                function() {
                    defered.reject(false);
                });

            return defered.promise;

        };
    }
    angular
        .module('jgTools.core.services.cache-link')
        .service('jgsCacheLinkServices', [
            '$http', '$q',
            jgsCacheLinkServices
        ]);
})();