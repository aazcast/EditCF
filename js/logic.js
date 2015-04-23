(function($){
    var $_settings;
    //Definimos el Plugin
    $.fn.editCF = function(options) {
        var $elm = this;

        //definimos las variables por default
        var config = $.extend({
            'editionTools' : true, //mostrar herramientas de edición
            'saveData' : true //guardar llave:valor JSON
        }, options);
        // console.log($elm)
        $_settings = options;
        init($elm, config['editionTools']);
    }

    var init = function (_elem, _tools){
        //Si tools es negativo no creamos el edition tools.
        if (!_tools) {
            _elem.append('<div id="editor" contenteditable></div>');
        } else {

            //creamos los botones para editar
            createEditionButtons(_elem);

            // $('#editionTools').append('<button class="btnEdit" id="bold">Bold</button><button class="btnEdit" id="italic">Italic</button><button class="btnEditformat" id="h1">H1</button>');
        }

        createSaveButton(_elem);
    }

    // creamos los botones de edición
    function createEditionButtons (_parent) {
        _parent.append('<div id="editionTools"></div><div id="editor" contenteditable></div>');

        var $container = $("#editionTools"),
            // 0 = Texto del button & 1 = Acción que ejecutará en el document.execCommand();
            $tools = [["Heading <span><i class='fa fa-header'></i><sup>1</sup></span>","h1"],["Heading <span><i class='fa fa-header'></i><sup>2</sup></span>","h2"], ["Bold <i class='fa fa-bold'></i>","bold"], ["Paragraph <i class='fa fa-paragraph'></i>","p"], ["Underline <i class='fa fa-underline'></i>","underline"],["Strike Through <i class='fa fa-strikethrough'></i>","strikeThrough"],["Center <i class='fa fa-align-center'></i>","justifyCenter"],["Undo <i class='fa fa-undo'></i>","undo"],["Redo <i class='fa fa-undo rotate-icon-right'></i>","redo"]];

        // alert(tools.length);

        $.each($tools, function (i, v) {
            var $btnTool = $("<button class='btn-edition'></button>");

            $btnTool.html(v[0]);
            $btnTool.attr("data-action", v[1]);

            $container.append($btnTool);
        });

        $(".btn-edition").on("click", editContent);
    }

    function editContent () {
        var $role = $(this).data("action");
        // alert($role);

        // insertar switch para manejar excepciones $role del document.execCommand();
        //Ejecutar botones
        switch($role) {
            case 'h1':
            case 'h2':
            case 'p':
              document.execCommand('formatBlock', false, $role);
              break;
            default:
              document.execCommand($role, false, null);
              break;
        }
    }

    // Creamos el buton de guardar contenido
    // una vez editado
    function createSaveButton(_elem) {
        var $btnSave = $("<button data-action='view-content' id='view-content'>Save</button>"),
            $editionTools = _elem.find("#editionTools");

        if ($editionTools) {
            $editionTools.before($btnSave);
        } else {
            _elem.append($btnSave);
        }

        $btnSave.on("click", readContent);
    }

    function readContent() {
        // console.log(this);
        var $editor = $("#editor");
            $content = $editor.children();

        // console.log($content);
        // alert($editor.children().length);

        var $EditCF_data = {};

        // Seteamos algunos metadatos para el Historial
        $EditCF_data.meta = {};
        $EditCF_data.data = [];
        $EditCF_data.meta.date = new Date().toString();
        $EditCF_data.meta.browser = (function () {
                                        var N = navigator.appName,
                                            ua = navigator.userAgent,
                                            tem;

                                        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);

                                        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) !== null) M[2] = tem[1];
                                        M = M? [M[1], M[2]] : [N, navigator.appVersion,"-?"];
                                        return M.join(" ");
                                    })();

        if (($editor.contents()[0]).nodeType === 3) {
            var $textNode = ($editor.contents()[0]).nodeValue,
                $node = {};

            // console.log($textNode);

            $node.element = "P";
            $node.content = $textNode;

            // console.log($node);

            ($EditCF_data.data).push($node);
        }


        $content.each(function () {
            // console.log(this);
            var $item = {};

            $item.element = this.nodeName;
            $item.content = this.innerHTML;

            if ($(this).attr("style")) {
                $item.style = [];

                var $styleTxt = $(this).attr("style"),
                    $styleObj = {};

                var $inlineCss = {},
                    $css = $styleTxt.split(":"),
                    $property = $css[0],
                    $value = ($.trim($css[1])).replace(";", "");

                // console.log($property, $value);

                $styleObj.property = $property;
                $styleObj.value = $value;

                // console.log($styleObj);

                ($item.style).push($styleObj);
            }

            ($EditCF_data.data).push($item);
        });

        // console.log($EditCF_data);

        if ($_settings["saveData"]) {
            // alert("Processing");
            saveContent($EditCF_data);
        }

        $editor.removeAttr("contenteditable");
        // $(this).remove();

        if ($_settings.callback) {
            $_settings.callback($EditCF_data);
        }
    }

    function saveContent (data) {
        data = JSON.stringify(data);

        if (!localStorage.getItem("EditCF")) {
            localStorage.setItem("EditCF", data);
        } else {
            localStorage.removeItem("EditCF");
            localStorage.setItem("EditCF", data);
        }
    }
}(jQuery));