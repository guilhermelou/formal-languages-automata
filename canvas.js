var _estados = [];
var _ray = 20;
function createNewState(posx, posy, color)
{
    var novoestado = new Estado();
    novoestado.setPosicao(posx, posy);
    novoestado.setCor(color);
    //novoestado.setId(_idCounter++);
    novoestado.setRaio(_ray);
    _estados.push(novoestado);
    desenhaEstados();
}