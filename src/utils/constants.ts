import { ChatOptions } from "./type"

const prefix = 'staring'

// dom id
export const BubbleButtonId = `${prefix}_bubbleButton`
export const ChatHolderId = `${prefix}_chatHolder`
export const ChatIframeId = `${prefix}_chatIframe`
export const HolderSpinner = `${prefix}_holderSpinner`


export const DefaultChatOptions: Partial<ChatOptions> = {

}

export const DefaultBubbleButtonBackgroundImage = {
	Open: "//mtbird-cdn.staringos.com/111144171373-1216141-41610-1141410-611010103032357.png",
	Close: "//mtbird-cdn.staringos.com/14100111131010-101025-41521-102214-045113111511016317.png"
}