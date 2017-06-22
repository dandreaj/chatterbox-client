// YOUR CODE HERE:
var app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  friends: {},  //meh?
  rooms: {},
  currentRoom: 'hackreactor',
  currentUser: window.location.search.slice(10),

  init: function() {
    var context = this;
    context.fetch();
    // setInterval(function() {   //In order to make this not seizure city, create a way to look at only new posts
    //   context.clearMessages();
    //   context.fetch();
    //   console.log('fetched data');
    // }, 1000);
    //Capturing and displaying initial state
    $('.username').on('click', function(event) {
      //console.log(event);
      var user = $(this).text();
      context.handleUsernameClick(user);
      //Method handleUsernameClick gets called
    });

    $('.messagebutton').click( function(event) {
      //console.log('hello world');
      console.log($('#message').val());
      var message = {
            username: context.currentUser,
            text: $('#message').val(),
            roomname: context.currentRoom
          };
      context.handleSubmit(message);
      event.preventDefault();
    });

    $('#refresh').on('click', function() {
      context.clearMessages();
      context.fetch();
      console.log('fetching data');
    });

    $('#roomSelect').change( function() {
      context.currentRoom = $('#roomSelect').val();
      context.clearMessages();
      context.fetch();
    });

  },

  //handleUsernameClick adds username to some list?
  handleUsernameClick: function(user) {
    if(!this.friends.hasOwnProperty(user)) {
        this.friends[user] = user;
    }
  },

  handleSubmit: function(message) {
    console.log('handleSubmit called');
    //connects to send method
    this.send(message);
  },

  send: function(message) {
    console.log(message);
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {

        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    var context = this;

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      data: "", //placeholder
      success: function(response) {
        console.log('chatterbox: Data retrieved');
        for (var i=0; i<response.results.length; i++) {
          context.renderMessage(response.results[i]);
          context.renderRoom(response.results[i].roomname)
        }
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  renderMessage: function(message) {
    if(message.roomname === this.currentRoom){
      // console.log(message);
      //save each property from this obj into different variables
      var username = xssFilters.inHTMLData(message.username);
      var text = xssFilters.inHTMLData(message.text);
      var roomname = xssFilters.inHTMLData(message.roomname);
      //create message asset
      var usernameElement = '<div class="username" data="' + username + '">' + username + '</div>';
      var textElement = '<div class="text">' + text + '</div>';
      var messageElement = '<div class="message" data="' + roomname + '">' + usernameElement + textElement + '</div>';
      // console.log(messageElement);
      $('#chats').append(messageElement);
    }


  },

  renderRoom: function(roomName) {
    var roomName = xssFilters.inHTMLData(roomName);
    if(!this.rooms.hasOwnProperty(roomName)) {
      this.rooms[roomName] = roomName;
      $('#roomSelect').append('<option value="' + roomName + '">'+roomName+'</option>');
    }
    //add roomRooms to list

  }
};

$(document).ready(function() {
  app.init();
});



//1. Display messages retrieved from server
//2. Setup a way to refresh messages (automatically or with button)
//3. Allow users to select username
//4. Allow users to send messages
//5. Create and visit rooms
//6. Befriend other users
//7. See messages from friends

//curl -X GET  -H "X-Parse-Application-Id: 72b8e073a4abde10221ce95f38ed1c63bd7f3d6b"  -H "X-Parse-REST-API-Key: cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a" http://parse.sfm8.hackreactor.com/chatterbox/classes/messages
