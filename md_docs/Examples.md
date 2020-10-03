# Cydran Examples

## Messaging

  Basic Messaging requies:
1. ***``Channel Name``***
1. ***``Message Type``***
1. ***``Payload``***
1. ***``Invoke Function``***

		class myClass extends Component {
			constructor() {
				super(TEMPLATE_STRING);
				
				// listening for direct messages
				this.on("messageType").invoke(this.myInvokeFunction);
				// listening for broadcast messages
				this.on("messageType").forChannel("channelName").invoke(this.myInvokeFunction);
			}
			
			sendMessage() {
				// publish a message directly
				this.message("channelName", "messageType", '');
				// broadcast a message
				this.broadcast("channelName", "messageType", { payloadProperty1: 'prop1'});
				// broadcast a message in the Cydran global scope
				this.broadcastGlobally("channelName", "messageType", [ 'element1', 'element2' ]);
			}
			
			myFunction(payload) {
				console.log(payload);
			}
    
    		}
		
[//]: # (New List)
1. another list
## Templates


