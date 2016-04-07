describe('component Menu', function() {
    var $compile,
        $rootScope;

    function getCompiledElement() {
        var compiledDirective = $compile('<jgc-menu items="items" ></jgc-menu>')($rootScope);
        $rootScope.$digest();
        return compiledDirective;
    }

    beforeEach(function() {
        // Load the myApp module, which contains the directive
        module('jgTools.components.menu');

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        inject(function(_$compile_, _$rootScope_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $rootScope.items = [{
                title: 'Dashboard',
                sref: 'sis.dashboard'
            }, {
                title: 'Components',
                submenu: [{
                    title: 'Layout',
                    sref: 'sis.layout'
                }, {
                    title: 'Google Chart',
                    sref: 'sis.googlechart'
                }]
            }];
        });



        directiveElem = getCompiledElement();
    });

    //it('config on isolated scope ', function() {
    //    var isolatedScope = directiveElem.isolateScope();
//
    //    isolatedScope.items[0].sref = "sis.hola";
//
    //    expect($rootScope.items[0].sref).toEqual('sis.hola');
    //});


    //it('se creo el menu', function() {
//
    //    expect(directiveElem.html()).toContain('<nav class="jgc-menu">');
    //});
//
    //it('se creo los componentes', function() {
//
    //    expect(directiveElem.html()).toContain('title="Dashboard"');
    //});
//
    //it('se creo el sub menu', function() {
    //    expect(directiveElem.html()).toContain('class="item parent');
    //    expect(directiveElem.html()).toContain('title="Google Chart"');
    //});
});