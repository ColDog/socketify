# Websockets for React and Node

An easy way to integrate React JS and Node with Websockets. Provides a protocol for using websockets to call functions on the server from the client, run them through middleware, and return them to the client. It also automatically updates the clients state when the server says that data has changed.

## Instructions
Clone the repository and run NPM install in both the client and the server folders. Then run node `simple_server.js` in the client folder, as well as `gulp`. Run `nodemon server.coffee` in the server folder. Nothing has been extracted out into a package so feel free to change things for your particular use case and send a pull request.

#### POST Requests through Websockets
When you set up a controller with the following code on the client:

    var CommentsController = new Controller({
        name: 'CommentsController', // name corresponds to server controller
        updatesTo: {
          all: myFunction // function called when 'all' query is updated with new comments
        }
      })

it provides a set of ready made functions. to allow you to connect with the server which is set up with the following on the server:

    App.Controllers.CommentsController = App.BaseController(App.Comments, 'CommentsController')
  
Now, from the client you can say:

    CommentsController.all().then(<success function>, <failure function>)
    
This emits (through websockets) a request to the server, specifying the controller `CommentsController` and the action `all`. Once the request is recieved, it is run through middleware, like authentication or more, including the middleware specified by the client, namely, `CommentsController.all`, which adds comments to the json request and sends it back to the client.

Further, this request is cached so the client knows it has already looked for all the comments. When the server sends an update through websockets saying that a comment has been updated, the client will request `CommentsController.all` again. You then specify the callback that should handle this response. This is very usefuly for React components. Just specify which element of the state should be updated, and the controller will take care of calling those functions when new data comes in.

## Example with React
Here is an example of the full `CommentBox` you would see in a React component. Check out the components folder above to see the full example.


```javascript
// Example CommentBox React component:
export default class CommentBox extends React.Component {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {data: []}
    this.handleSubmit = this.handleSubmit.bind(this)
    
    // define the 'store' or the controller
    this.store = new Controller({
      name: 'CommentsController',
      updatesTo: {
        
        // when 'all' needs to be updated, the controller
        // will call this.setState(data) with the new comments
        all: this.setState.bind(this)
      }
    })
  }

  handleSubmit(comment) {
    this.state.data.push(comment) // eagerly push onto the state
    
    // create called on the server, sends an update to the 
    // client who asks for all the comments automatically. 
    // This is all you have to do to update all the other browsers!
    this.store.create(comment)    
  }

  componentDidMount() {
  
    // Gets all of the comments and caches the query to be reused.
    // no need for a callback because we specified in the controller
    // initialization that any updates to the query 'all' will update
    // the state with the new data.
    this.store.all()
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onSubmit={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}
.
.
.
```

## Regular Example
Want to just get data and do something with it when new information comes in?

```
function addComments(comments) {
  // add comments to an element
}

var CommentsController = new Controller({
  name: 'CommentsController',
  updatesTo: {
    
    // when 'all' needs to be updated, the controller
    // will call this function with the new comments
    all: updateAllComments
  }
})

$(document).ready(function(){
  CommentsController.all()
}
```

## Help with Development!
Please!, do you like this idea? Let's build it out!
