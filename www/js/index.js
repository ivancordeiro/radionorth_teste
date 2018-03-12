
baseUrl = 'http://ivanprogramador.com.br/teste/radio/';
baseCliente = 'cliente/';
baseArquivos = 'arquivos/';
baseLaudos = 'pdf/';
pastaLocal = 'RadioNorth/';
tokenLogado = '';
idLogado = '';
nomeLogado = '';
tipoLogado = '';
ultimoPedido = '';
totalPedidos = '';
vezPedidos = 1;
qtosPedidosTem = 0;
altTela = parseInt( screen.height ) ;



document.addEventListener("deviceready", onDeviceReady, false); 


function onDeviceReady() {

modelo =  device.model;
plataforma = device.platform;
uuid = device.uuid;
version =  device.version;
serial = device.serial;



//*
$("#bt_logar").click(function(){
logar();
});


$("#bt_downloads").click(function(){
downloads();
});


onInit();
//*/

}













function atualizar(){
LimpaDownloads();
checaLogin();
}












function logar(){


var conn = conexao();
if( conn == 'none' || conn == 'NONE' ){ //conn

alert('O aplicativo nao detectou conexao com internet.');

} else {//conn



var logValidou = 's';
var logMSG = '';
var logTipo = '';

//alert('logando');

var logLogin = $("#login").val();
var logSenha = $("#senha").val();
//var tipo = 'cli';


var rads = document.getElementsByName('tipo');
   
  for( var i = 0; i < rads.length; i++ ){
   if(rads[i].checked){   logTipo = rads[i].value;    }   
  }

var dadosLog = "login=" + logLogin + "&senha=" + logSenha + "&tipo=" + logTipo;
//alert('dados: ' + dadosLog);


if( logLogin == '' ){
logValidou = 'n';
logMSG += 'Preencha o Login \n';
}

if( logSenha == '' ){
logValidou = 'n';
logMSG += 'Preencha a Senha \n';
}

if( logTipo == '' ){
logValidou = 'n';
logMSG += 'Escolha o tipo de usuario ';
}




if( logValidou == 'n' ){//vali

alert( logMSG );

} else {//vali

	
$.ajax({
//
dataType: "json",
type: "POST",
url: baseUrl + baseCliente + "app_logando.php?sid=" + +Math.random(),
data: dadosLog ,
crossDomain: true,
cache: false,

success: function(retorno){ 
//alert(retorno);

//alert(  "Testando retorno logar : logou: " + retorno.logou + ", msg: " + retorno.msg  + ", token: " + retorno.token   + ", nome: " + retorno.nome  + ", tipo: " + logTipo );


if( retorno.logou == 's' ){

onCreateDB( retorno.token, retorno.nome, logTipo );

} else {
alert( 'Falha ao logar: ' + retorno.msg );
}

}
,beforeSend: function(){
},
complete: function(){
}

});




}//vali



}//conn


}













function deslogar(){

//alert('deslogando');

tokenLogado = '';
idLogado = '';
nomeLogado = '';
tipoLogado = '';
onDeleteGeralDB();
telaLogin();

	
$.ajax({
url: baseUrl + baseCliente + "app_logando.php?acao=deslogar&sid=" + +Math.random(),
crossDomain: true,
cache: false,

success: function(retorno){ 

}

});



}



function aba1(){
$("#aba2").hide();
$("#aba1").show();
}

function aba2(){
$("#aba1").hide();
$("#aba2").show();
}







function telaLogin(){

$("#divConteudo").hide();
$("#divLogar").show();
fechaBrowser();
LimpaDownloads();

}



function telaConteudo(){

abreBrowser();
downloads();
$("#divConteudo").show();
$("#divLogar").hide();
aba1();

if( altTela != '' && altTela > 300 ){
var h_ifr = altTela - 100;
document.getElementById('ifrBrowser').style.height = h_ifr + 'px';
}

}



function LimpaDownloads(){
ultimoPedido = '';
totalPedidos = '';
vezPedidos = 1;
qtosPedidosTem = 0;
document.getElementById('divDownloads').innerHTML = '';
}













function downloads(){

var conn = conexao();
if( conn == 'none' || conn == 'NONE' ){ //conn

alert('O aplicativo nao detectou conexao com internet.');

} else {//conn


var dadosDown = "tokenUsu=" + tokenLogado + "&tipoUsu=" + tipoLogado + "&ultimoPedido=" + ultimoPedido  + "&totalPedidos=" + totalPedidos + "&vezPedidos=" + vezPedidos;
//alert('dados: ' + dadosDown);
	
$.ajax({
// 
dataType: "json",
type: "POST",
url: baseUrl + baseCliente + "app_downloads.php?sid=" +Math.random() ,
data: dadosDown ,
crossDomain: true,
cache: false,

success: function(retorno){ 

//alert(retorno);



ultimoPedido =  retorno['ultimo'] ; 
totalPedidos =  retorno['total'] ;
vezPedidos = vezPedidos + 1;
qtosPedidosTem = qtosPedidosTem + parseInt( retorno['qtosPedidosVeio'] ) ;




/*
alert ( 'teste:' + retorno['teste']  );
alert ( 'total:' + retorno['total']  + ',' + totalPedidos );
alert ( 'qtosPedidosTem:' + qtosPedidosTem ) ;
alert ( 'qtosPedidosVeio:' + retorno['qtosPedidosVeio']  );
alert ( 'vezPedidos:' + vezPedidos ) ;
alert ( 'ultimoPedido:' + ultimoPedido + ', ' + retorno['ultimo'] ) ;
*/

var html = '';
for (  var pedido in retorno['pedidos']  ){//1

var idpedido = retorno['pedidos'][pedido]['idpedido'];

//alert('pedido:' + pedido);
//alert('idpedido:' + idpedido);

//inicio div pedido
html += '<div style="clear:both; border:1px solid #000; padding:5px;  margin-bottom:10px; background:#fff; -webkit-border-radius:5px;-moz-border-radius:5px; border-radius: 5px;  ">';

html += '<div style="clear:both; border-bottom:1px solid #576E5E; padding-bottom:5px; ">';
html += retorno['pedidos'][pedido]['ident'] + '<br>';
html += '</div>';


for (  var arq in retorno['pedidos'][pedido]['arquivos']  ){//2

var arquivo = retorno['pedidos'][pedido]['arquivos'][arq]['arquivo'];
var dataarq = retorno['pedidos'][pedido]['arquivos'][arq]['data'];
var nomearq = retorno['pedidos'][pedido]['arquivos'][arq]['nome'];

var identBtn = 'bt_arq_' + idpedido + '_' + arq  ;
//alert('identBtn: ' + identBtn);

html += '<div style="clear:both; border-bottom:1px solid #576E5E; padding-bottom:5px; ">';
html += 'ARQ:' + arquivo + '<br>';
html += 'Data:' + dataarq +'<br>' ;
html += '<input id="'+ identBtn +'" type="button" onClick="baixarArquivo(\''+arquivo+'\',\'arq\',\''+idpedido+'\',\'\',\''+identBtn+'\')" value="Baixar" style="background-color:#63886F;width:120px; -webkit-border-radius:5px;-moz-border-radius:5px; border-radius: 5px; height:40px; padding:5px; color:#fff; font-weight:bold; font-size:15px; cursor: pointer;">'   +   '<br>' ; 
html += '</div>';
}//2



for (  var lau in retorno['pedidos'][pedido]['laudos']  ){//3

var idlau = retorno['pedidos'][pedido]['laudos'][lau]['idlaudo'];
var datalau = retorno['pedidos'][pedido]['laudos'][lau]['data'];
var tokenlau = retorno['pedidos'][pedido]['laudos'][lau]['token'];
var nomealaudo = retorno['pedidos'][pedido]['laudos'][lau]['nomealaudo'];

var identBtn = 'bt_lau_' + idpedido + '_' + idlau;

html += '<div style="clear:both; border-bottom:1px solid #576E5E; padding-bottom:5px; ">';
html += nomealaudo + '<br>';
html += 'Data:' + datalau +'<br>' ;
html += '<input id="'+identBtn+'" type="button" onClick="baixarArquivo(\''+nomealaudo+'\',\'lau\',\''+idpedido+'\',\''+tokenlau+'\',\''+identBtn+'\')" value="Baixar" style="background-color:#63886F;width:120px; -webkit-border-radius:5px;-moz-border-radius:5px; border-radius: 5px; height:40px; padding:5px; color:#fff; font-weight:bold; font-size:15px; cursor: pointer;">'   +   '<br>' ; 
html += '</div>';







}//3

html += '</div>';
//inicio div pedido

}//1

//$("#divDownloads").html( html );
document.getElementById('divDownloads').innerHTML += html;



if(  totalPedidos != '' &&  parseInt( totalPedidos ) > 0 &&  parseInt( qtosPedidosTem )  < parseInt( totalPedidos )  ){
$("#bt_downloads").show();
} else {
$("#bt_downloads").hide();
}





}
,beforeSend: function(){
},
complete: function(){
}

});


}//conn

}







function abreBrowser(){

var conn = conexao();
if( conn == 'none' || conn == 'NONE' ){ //conn

alert('O aplicativo nao detectou conexao com internet.');

} else {//conn

var urlBrow = baseUrl + baseCliente + 'lis_pedidos.php?app=s&tokenUsu=' + tokenLogado  + '&tipoUsu=' + tipoLogado ;
//alert( 'urlBrow: ' + urlBrow );
ifrBrowser.location.href =  urlBrow;

}//conn

}







function fechaBrowser(){
ifrBrowser.location.href='embranco.html';
}








function conexao(){
var networkState = navigator.connection.type;
return networkState;
}



/*
function pedidos(){
alert('pedidos');
location.href='lis_pedidos.html';
}
*/









function baixarArquivo(arq,tipo,idped,token, ident){ 

var conn = conexao();
if( conn == 'none' || conn == 'NONE' ){ //conn

alert('O aplicativo nao detectou conexao com internet.');

} else {//conn



//alert('ident: ' + ident);

//alert('chamou funcao dowload');
$("#" + ident).val( 'Baixando...' );

if( tipo == 'lau' ){
var arquivoBX = baseUrl + baseLaudos + 'laudo.php?token=' + token ; 
//var arquivoBX2 = 'ped' + idped + '/Laudo_' + token + '.pdf' ;
var arquivoBX2 = 'ped' + idped + '/' + arq ;
} else {
var arquivoBX = baseUrl + baseArquivos + arq;
var arquivoBX2 = 'ped' + idped + '/' + arq ;
}

	var myPath = cordova.file.externalRootDirectory; // We can use the default externalRootDirectory or use a path : file://my/custom/folder
	//alert('myPath - externalRootDirectory dados externos cartao:' + myPath);


		var ft = new FileTransfer();
		
		ft.download(

		  arquivoBX, // what u download
		  myPath + pastaLocal + arquivoBX2, // this is the filename as well complete url
		  function(entry) {
			alert("O arquivo foi baixado com sucesso!");
			//alert(JSON.stringify(entry));
            $("#" + ident).val( 'Baixar' );		
		  },
		  function(err) {
			alert('Erro ao fazer o download do arquivo:'+ err);
			//alert(JSON.stringify(err));
            $("#" + ident).val( 'Baixar' );
		  }	
		);



}//conn

}



function fechar(){
navigator.app.exitApp();
}