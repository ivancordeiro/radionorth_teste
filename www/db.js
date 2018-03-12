//1. Inicialização

var localDB = null;







function onInit(){

//alert('chamou init ');


var conn = conexao();
//var conn = navigator.connection.type;
if( conn == 'none' || conn == 'NONE' ){ //conn

alert('O aplicativo nao detectou conexao com internet.');
telaLogin();

//alert('teste1');

} else {//conn

//alert('conn:' + conn);

//alert('teste2');


    try {
        if (!window.openDatabase) {
            updateStatusDB("Erro: Seu navegador não permite banco de dados.");
        }
        else {
           initDB();
           createTables();
            //onDeleteTables();
           // onAddColuna('teste','VARCHAR ');
           // onUpdateDB( 3, 'joao23', 'daa4s57ree23', 'cli' ); //id, nome, token, tipo 
            //onDeleteDB(2);//id


            checaLogin();
      

        }
    } 
    catch (e) {
        if (e == 2) {
            updateStatusDB("Erro: Versão de banco de dados inválida.");
        }
        else {
            updateStatusDB("Erro: Erro desconhecido ao criar o banco: " + e + ".");
        }
        return;
    }





}//conn

//alert('finalizou init ');

}













function initDB(){
    var shortName = 'radDB';
    var version = '1.0';
    var displayName = 'MyRadDB';
    var maxSize = 1048576; // Em bytes - 1mb
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}


function createTables(){
    var query = 'CREATE TABLE IF NOT EXISTS usuario(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome VARCHAR NOT NULL, token VARCHAR NOT NULL,tipo VARCHAR NOT NULL );';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandlerDB);
           // updateStatusDB("Tabela 'usuario' status: OK.");
        });
    } 
    catch (e) {
        updateStatusDB("Erro: Data base 'usuario' não criada " + e + ".");
        return;
    }
}





function onDeleteTables(){
    var query = 'DROP TABLE IF EXISTS usuario ;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandlerDB);
        });
    } 
    catch (e) {
        updateStatusDB("Erro: Data base 'usuario' não criada " + e + ".");
        return;
    }
}



function onAddColuna(coluna,tipo){
    var query = 'ALTER TABLE usuario ADD COLUMN ' + coluna + ' ' + tipo +' ;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandlerDB);
        });
    } 
    catch (e) {
        updateStatusDB("Erro: Data base 'usuario' não criada " + e + ".");
        return;
    }
}





function onUpdateDB( id, nome, token, tipo ){

        var query = "update usuario set nome=?, token=?, tipo=? where id=?;";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, token, tipo, id], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatusDB("Erro: Update não realizado.");
                    }
                    else {
                        //updateStatusDB("Update realizado:" + results.rowsAffected);
                    }
                }, errorHandlerDB);
            });
        } 
        catch (e) {
            updateStatusDB("Erro: UPDATE não realizado " + e + ".");
        }
    
}




function onDeleteDB(id){
    var query = "delete from usuario where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
                if (!results.rowsAffected) {
                    updateStatusDB("Erro: Delete não realizado.");
                }
                else {
                    //updateStatusDB("Linhas deletadas:" + results.rowsAffected);
                }
            }, errorHandlerDB);
        });
    } 
    catch (e) {
        updateStatusDB("Erro: DELETE não realizado " + e + ".");
    }
    
}




function onDeleteGeralDB(){
    var query = "delete from usuario ;";
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandlerDB);
            //alert('deletou dados antigos em off');
        });
    } 
    catch (e) {
        updateStatusDB("Erro: Dados tabela nao excluidos " + e + ".");
        return;
    }
}




function onCreateDB( token, nome, tipo ){
    if ( token != "") {

      onDeleteGeralDB();

        var query = "insert into usuario (nome, token, tipo) VALUES (?, ?, ?);";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, token, tipo], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatusDB("Erro: Inserção no banco não realizada");
                    }
                    else {
                        //updateStatusDB("Inserção realizada, linha id: " + results.insertId);
                        checaLogin();
                    }
                }, errorHandlerDB);
            });
        } 
        catch (e) {
            updateStatusDB("Erro: INSERT LOGIN OFF nao realizado " + e + ".");
        }

    }
}











function checaLogin(){

//alert('chamou checaLogin ');

    var query = "SELECT * FROM usuario order by id desc limit 1 ;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
            var qtaslinhas = results.rows.length;

					
					//alert('qtaslinhas: ' + qtaslinhas);
					
					if( qtaslinhas > 0 ){
					
					var row = results.rows.item(0);
					tokenLogado = row['token'];
					idLogado = row['id'];
					nomeLogado = row['nome'];
					tipoLogado = row['tipo'];
					
					} else {
					
					tokenLogado = '';
					idLogado = '';
					nomeLogado = '';
					tipoLogado = '';
					
					}
					
					//alert('tokenLogado: ' + tokenLogado + ', idLogado: ' + idLogado);               
					
					
					if( tokenLogado == '' ){
					
					//alert(' teste 1 ' ); 
					telaLogin();
					
					} else {
					
					//alert(' teste 2 ' ); 
					telaConteudo();
					
					}



            }, function(transaction, error){
                updateStatusDB("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        updateStatusDB("Error: SELECT não realizado " + e + ".");
    }
}









// Funções de tratamento e status.

errorHandlerDB = function(transaction, error){
    updateStatusDB("Erro: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}


function updateStatusDB(status){
    alert(status);
}

