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
				this.on("messageType").invoke(this.myFunction);
				// listening for broadcast messages
				this.on("messageType").forChannel("channelName").invoke(this.myFunction);
			}
			
			sendMessage() {
			
			}
			
			myFunction(payload) {
				// publish a message directly
				this.message("channelName", "messageType", somePayLoad);
				// broadcast a message
				this.broadcast("channelName", "messageType", somePayLoad);
				// broadcast a message in the Cydran global scope
				this.broadcastGlobally("channelName", "messageType", somePayLoad);
			}
    
    		}
		
[//]: # (New List)
1. another list
## Templates


