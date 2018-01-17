         
         var base_url = "http://www.henriquesantos.pro.br:8080/api/trello/";
         
         // Função usada para cadastrar
        function add(data,url,funcao=false){           
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {                           
                 if (this.readyState == 4 && this.status == 200)
                  {                                                                                                 
                    if(funcao)
                       funcao();                                                          
                  }
            };

           xhttp.open("POST", url, true);
           xhttp.setRequestHeader("Content-type", "application/json");            
           xhttp.send(JSON.stringify(data));                                
       };
       
       // Retorna as listas 
       function read(url,funcao){      
          
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {
                 if (this.readyState == 4 && this.status == 200)
                  {                   
                    var obj_conexao = JSON.parse(this.responseText);                                                       
                    obj_conexao.forEach(funcao);                                                                           
                  }
            };

            xhttp.open("GET",url,true);                           
            xhttp.send();                                
      };
      

       ////////////////////
        // USUÁRIO       // 
        ////////////////////
          if(document.getElementById("formLogin")){

            document.getElementById("formLogin").addEventListener("submit", function(evt){

              evt.preventDefault();

              document.querySelector('#msg').style.visibility = "hidden";

              var url = base_url + "login"; 

              var data =  { "username":document.querySelector('#username').value, "password": document.querySelector('#senha').value }    
                
                realizarLogin(data,url);                 
            });
          };

          function realizarLogin(data,url){
                                 
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function()
                {              
                     if (this.readyState == 4)
                      {  
                        var result = JSON.parse(this.responseText); 
                        if (this.status == 200)
                        {                                                                              
                                                                                    
                          localStorage.setItem("token",result.token);                              
                          window.location.href = "index.html";                   
                        }
                         else if(this.status == 400)
                        {                      
                            document.querySelector('#msg').innerHTML = result.errors[0].message;
                            document.querySelector('#msg').style.visibility = "visible";
                        }

                      }                 
                };

               xhttp.open("POST", url, true);
               xhttp.setRequestHeader("Content-type", "application/json");            
               xhttp.send(JSON.stringify(data));                                
           };

           if(document.getElementById("encerrarSessao")){

            document.getElementById("encerrarSessao").addEventListener("click", function(evt){

              localStorage.clear();
              sessionStorage.clear();
                                          
              window.location.href = "login.html";                 
            });
          };

       ////////////////////
      // BOARDS         // 
      //////////////////// 

       // Adicionar um novo board
      if(document.getElementById("criarBoard"))
      {
          
          document.getElementById("criarBoard").addEventListener("click", function(evt){               

            var url  = base_url + "boards/new";    
            var data =  { name:document.querySelector('#nomeBoard').value, token:localStorage.getItem("token")};           

            clearElement("boardsUsuario");

            add(data, url, read(base_url + "boards/" + localStorage.getItem("token"),showBoards));
             
          });

      };

       // Exibe os boards do usuário
      function showBoards(data){                 
                                                
               var container =  document.getElementById("boardsUsuario");

               var boards = '<a onclick="loadLists('+data.id+')" href=""><div class="panel panel-default col-md-4"><div class="panel-body" style="margin: 15px;">'+data.name+'</div></div></a>';
               
               container.insertAdjacentHTML('afterbegin', boards);
      };

      ////////////////////
      // LISTS          // 
      ////////////////////
     
     // Adiciona uma nova lista 
     if(document.getElementById("criarLista"))
     {
      
        document.getElementById("criarLista").addEventListener("click", function(evt){        

          evt.preventDefault();       

          var url  = base_url + "lists/new"; 

          var data =  { name:document.querySelector('#nomeLista').value, token:localStorage.getItem("token"), board:sessionStorage.getItem("board")}; 
          
          clearElement("listasUsuario");

          var url_refresh = base_url + "lists/" + localStorage.getItem("token") + "/board/" + sessionStorage.getItem("board");

          add(data, url, loadLists(sessionStorage.getItem("board")));

        }); 
     };

     // Carrega a página de list's de um board específico
      function loadLists(data){                 
         sessionStorage.setItem("board",data);  
         window.location.href = "lists.html";                                                                                                                                                                                     
      };

      // Exibe a lista de list's de um board
      function showLists(data){          
        
              var list = document.getElementById("listasUsuario");

              var listBody =  
              '<div class="col-xs-12 col-md-4 col-sm-4">'+                       
              '<div class="panel panel-default">'+
                '<div class="panel-heading">'+data.name+'</div>'+
                '<div lista="'+data.id+'" class="panel-body" ondrop="drop(event)" ondragover="allowDrop(event)">'+                   
                  '<div id="list'+data.id+'" class="list-group">'+                                               
                  '</div>'+
                '</div>'+
                '<div class="panel-footer">'+
                '<div class="input-group">'+
                '<input id="nomeCard'+data.id+'" type="text" class="form-control" placeholder="Novo card">'+
                
                '<span class="input-group-btn">'+
                  '<button onclick="addCard('+data.id+')" class="btn btn-default" type="button">+</button>'+
                '</span>'+
              '</div>'+
              '</div>'+
              '</div>'+
             '</div>'+ 
            '</div>';

            list.insertAdjacentHTML('afterbegin', listBody);

             var url = base_url + 'cards/'+ localStorage.getItem("token") 
              + '/list/' + data.id;                                                    

             read(url,showCards);              

      };

      ////////////////////
      // CARDS          // 
      ////////////////////

       // Adiciona um novo card
      function addCard(idList)
      { 
              
         sessionStorage.setItem("list",idList);                                                                       

         var url  =  base_url + "cards/new";
          
         var data =  { name:document.querySelector("#nomeCard"+idList).value, token:localStorage.getItem("token"), list:sessionStorage.getItem("list")};            
                 
         clearElement("listasUsuario");

         add(data, url, loadLists(sessionStorage.getItem("board")));
                                    
      };

      // Exibir a lista de card's de uma list
      function showCards(data){                                      

           var list = document.getElementById("list"+data.trelloListId);
           var card  = document.createElement("a");
           card.setAttribute("href","#");
           card.setAttribute("class","list-group-item");
           card.setAttribute("id","card"+data.id);  
           card.setAttribute("draggable","true");
           card.setAttribute("ondragstart","drag(event)"); 
           card.setAttribute("data-toggle","modal");
           card.setAttribute("data-target","#modalCard");
           card.setAttribute("onclick","getCard("+data.id+")"); 
                    
           var cardTitle  = document.createElement("h4");
           cardTitle.setAttribute("class","list-group-item-heading");
                              
           var cardText  = document.createTextNode(data.name); 
            
           list.appendChild(card);
           card.appendChild(cardTitle);
           cardTitle.appendChild(cardText); 

           url = base_url + "cards/" + localStorage.getItem("token") + "/" + data.id + "/tags";          
           
           read(url,function(dados){
            var tag  = document.createElement("span");            
            tag.setAttribute("style","background-color: "+ dados.color);
            tag.setAttribute("class","badge");
            card.appendChild(tag);
           });
                                                                                                                                                                                                               
      };


         
       // Recupera um card específico
       function getCard(data){                
          
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {              
                 if (this.readyState == 4 && this.status == 200)
                  {                                                                                                 
                    data = JSON.parse(this.responseText);
                    
                    var cardTitle = document.getElementById("tituloCard");
                    cardTitle.innerHTML = "";          
                    sessionStorage.setItem("card",data.id);

                    var text = document.createTextNode(data.name);
                     cardTitle.appendChild(text);

                     var url = base_url + "cards/"+ localStorage.getItem("token") +"/" + data.id +"/comments";
                     clearElement("comentarios");
                     read(url,showComments);

                     url = base_url + "tags";
                     clearElement("tags"); 
                     read(url,showTags);                   
                  }
            };            
            
           xhttp.open("GET", base_url + "cards/"+localStorage.getItem("token")+"/"+data, true);                      
           xhttp.send();                                
       };

       //  Altera a lista do card
      function editListCard(data){
          
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {              
                 if (this.readyState == 4 && this.status == 200)
                  {                                                                                                 
                    console.log(JSON.parse(this.responseText));                   
                  }
            };

           xhttp.open("PATCH", base_url + "cards/changelist", true);
           xhttp.setRequestHeader("Content-type", "application/json");            
           xhttp.send(JSON.stringify(data));                                
       };

       ////////////////////
      // COMENTARIOS     // 
      ////////////////////
      
      // Adiciona um novo comentário
       if(document.getElementById("novoComentario"))
      {
        
          document.getElementById("novoComentario").addEventListener("click", function(evt){        

            evt.preventDefault();       

            var url  =  base_url + "cards/addcomment";    
            var data =  { card:sessionStorage.getItem("card"), comment:document.querySelector('#textoComentario').value, token:localStorage.getItem("token")};              
            
            add(data,url,function () {
               url = base_url + "cards/"+localStorage.getItem("token")+"/"+sessionStorage.getItem("card")+"/comments";
               clearElement("comentarios");
               read(url,showComments);
            });            

          }); 
      };

       // Lista os comentários de um card
      function showComments(data)
      {
                  
        var list  = document.getElementById("comentarios");        
        var card  = document.createElement("a");
        var title = document.createTextNode(data.comment);           
           
          card.setAttribute("class","list-group-item");        
          card.appendChild(title);
          list.appendChild(card);           
      };

      ////////////////////
      // TAGS           // 
      ////////////////////

      // Adiciona uma nova tag ao card
      function addTag(data){

            var url    = base_url + "cards/addtag";
            var value  = {card:sessionStorage.getItem("card"),tag:data, token:localStorage.getItem("token")};                               
            add(value,url);

             url = base_url + "lists/" + localStorage.getItem("token") + "/board/" + sessionStorage.getItem("board");
             clearElement("listasUsuario");
             read(url,showLists);
      };
      
      // Carrega a lista de tags
      function showTags(data) {
        
        var list   = document.getElementById("tags");
        var a      = document.createElement("a");
        var li     = document.createElement("li");
        var title  = document.createTextNode(data.tag);
       

          a.setAttribute("onclick",'addTag("'+data.id+'")');
          a.setAttribute("class","tagDescription");

          li.style.backgroundColor = data.color;
          li.style.color = data.color;          
          a.appendChild(li);
          li.appendChild(title);
          list.appendChild(a); 
            
      }


      ////////////////////
      // OUTRAS FUNÇÕES // 
      ////////////////////

      // Limpa o elemento (recebe o id) 
      function clearElement(data){               

           document.getElementById(data).innerHTML = "";                                                                                                                                                                                                     
      };

      function drag(ev)
      {       
          ev.dataTransfer.setData("text", ev.target.id);          
      };

      function drop(ev)
      { 

         if(ev.target.nodeName == "DIV"){

           var list  = ev.target.attributes[0].value;
           var card  = ev.dataTransfer.getData("text").substring(4);
           var data  = { token: localStorage.getItem("token"), card: card, list: list };

           editListCard(data);

            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
            ev.preventDefault();
         }     
         
      };

      function allowDrop(ev)
      {
          ev.preventDefault();
      };     
       