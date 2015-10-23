# Websockets for React and Node

An easy way to integrate React JS and Node with Websockets. Provides a protocol for calling functions on the server back end from the client. It tries to be like Meteor minus all of the magic.

## Instructions
Clone the repository and run NPM install in both the client and the server folders. Then run node `simple_server.js` in the client folder, as well as `gulp`. Run `nodemon server.coffee` in the server folder. Nothing has been extracted out into a package so feel free to change things for your particular use case and send a pull request.

#### POST Requests through Websockets
When you set up a controller with the following code on the client:

    var CommentsController = new Controller('CommentsController')

it provides a set of ready made functions. to allow you to connect with the server which is set up with the following on the server:

    App.Controllers.CommentsController = App.BaseController(App.Comments, 'CommentsController')
  
Now, from the client you can say on the client:

    CommentsController.all().then(<success function>, <failure function>)
    
This emits (through websockets) a request to the server, specifying the controller `CommentsController` and the action `all`. Once the request is recieved, it is run through middleware, like authentication or more, including the middleware specified by the client, namely, `CommentsController.all`, which adds comments to the json request and sends it back to the client.

Further, this request is cached so the client knows it has already looked for all the comments. When the server sends an update through websockets saying that a comment has been updated, the client will request a new comment. When it gets this comment, you can specify an automatic callback to be applied for queries. This is specifically useful for React components where the state is handled automatically by the controller and the specified callback.

## Example with React
Here is an example of the full `CommentBox` you would see in a React component:


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
        
        // when 'all' needs to be updated, use this callback
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
```

## Help with Development!
Please!, do you like this idea? Let's build it out!
