import {channel, topic} from "@inngest/realtime"

export const httpRequestChannel = channel('http-request-channel').addTopic(
    topic("status").type<{nodeId:string ,status:"loading" | "error" | "success"}>()
)