export class channel
{
    constructor(channelName, channelCreator)
    {
        this.channelName = channelName;
        this.channelCreator = channelCreator;
        this.messageHistory =[];
    }
}