var State = function(){
    this.x = 0;
    this.y = 0;
    this.color;
    this.ray = 20;
    this.out_links = [];
    this.in_links = [];
    this.initial = false;
    this.finaL = false;
};

State.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
};

State.prototype.getXY = function() {
    return{
        "x": this.x,
        "x": this.y
    }
};


var Link = function(){
    //classe para representar a ligação grafica (linhas) dos automatos

    
    //variavel boleana para definir se esta ligacao é uma curva ou não
    this.curva = false;
    this.cima = 1;
    this.transicoes = []; //array de transicoes


    this.setIdOrig = function(idO)
    {
        this.idOrig = idO;
    };

    this.setIdDest = function(idD)
    {
        this.idDest = idD;
    };

    this.getIdOrig = function()
    {
        return this.idOrig;
    };

    this.getIdDest = function()
    {
        return this.idDest;
    };

    this.setCurva = function(curva)
    {
        this.curva = curva;
    };

    this.getCurva = function()
    {
        return this.curva;
    };

    this.addTransicao = function(n_transicao)
    {
        transicoes.push(n_transicao);
    };

    this.getTransicoes = function()
    {
        return transicoes;
    };

    this.setCima = function(n_cima)
    {
        cima = n_cima;
    };

    this.getCima = function()
    {
        return cima;
    };



function LigacaoV()
{
    //classe para representar a ligação para verificação do automato

    
    this.idOrig; //id do estado origem desta ligação
    this.idDest; //id do estado destino desta ligação
    this.transicao; //transicao texto


    this.setIdOrig = function(idO)
    {
        this.idOrig = idO;
    };

    this.setIdDest = function(idD)
    {
        this.idDest = idD;
    };

    this.getIdOrig = function()
    {
        return this.idOrig;
    };

    this.getIdDest = function()
    {
        return this.idDest;
    };


    this.setTransicao = function(n_transicao)
    {
        transicao = n_transicao;
    };

    this.getTransicao = function()
    {
        return transicao;
    };


function Nota()
{
    this.text;//texto da nota atual
    this.posx, posy;//posição gráfica da nota atual
    this.width, height;//largura e altura gráfica da nota atual
    this.alpha;
    this.id; // id nota atual

    this.setId = function(_id)
    {
        this.id = _id;
    };

    this.getId = function()
    {
        return this.id;
    };

    this.setPosicao = function(x, y)
    {
        this.posx = x;
        this.posy = y;
    };

    this.setSize = function(w, h)
    {
        this.width = w;
        this.height = h;
    };

    this.getWidth = function()
    {
        return this.width;
    };

    this.getHeight = function()
    {
        return this.height;
    };

    this.setText = function(t)
    {
        this.text = t;
    }

    this.getText = function()
    {
        return this.text;
    };

    this.getPosX = function()
    {
        return this.posx;
    };

    this.getPosY = function()
    {
        return this.posy;
    };

    this.setTranslucent = function()
    {
        this.alpha = '.4';
    }

    this.setOpaque = function()
    {
        this.alpha = '1';
    }

    this.getAlpha = function()
    {
        return this.alpha;
    }
}


function Passo()
{
    this.estado;
    this.cadeia;

    this.setEstado = function(n_estado)
    {
        this.estado = n_estado;
    }

    this.getEstado = function()
    {
        return this.estado;
    }

    this.setCadeia = function(n_cadeia)
    {
        this.cadeia = n_cadeia;
    }

    this.getCadeia = function()
    {
        return this.cadeia;
    }
}


function Transicao()
{
    //classe para armazenar a transição de uma um automato finito


    this.texto_transicao;        //variável para armazenar a transição
    this.rect_x, rect_y, rect_width, rect_height;

    this.setTransicao = function(t)
    {
        this.texto_transicao = t;
    };
    
    this.setRect = function(x, y, width, height)
    {
        this.rect_x = x;
        this.rect_y = y;
        this.rect_width = width;
        this.rect_height = height;
    };

    this.getTransicao = function()
    {
        return this.texto_transicao;
    };

    this.getRectX = function()
    {
        return this.rect_x;
    };

    this.getRectY = function()
    {
        return this.rect_y;
    };  

    this.getRectWidth = function()
    {
        return this.rect_width;
    };  

    this.getRectHeight = function()
    {
        return this.rect_height;
    };  

}