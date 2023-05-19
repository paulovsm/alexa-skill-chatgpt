// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const { Configuration, OpenAIApi } = require('openai');
const keys = require('./keys');

const configuration = new Configuration({
    apiKey: keys.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Oi, como posso ajudar?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ChatGPTIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatGPTIntent';
    },
    async handle(handlerInput) {
        const question = Alexa.getSlotValue(handlerInput.requestEnvelope, 'question');

        console.log("Question is: " + question);

        const prompt = `Você é um Assistente de IA que adora ajudar os usuários! 
        Você deve converter todas as suas respostas para o formato Speech Synthesis Markup Language (SSML), de modo a tornar a resposta mais natural e fluida para o usuario.
        Segue um exemplo de resposta:
        Speech Synthesis Markup Language (SSML)
        
        <speak>
        <p>
            As conversas obtidas pela Polícia Federal a partir da quebra de sigilos incluem recibos de depósitos financeiros, enviados por ajudantes de ordens da Presidência em um grupo de aplicativo de mensagens.
        </p>
        <p>
            Nesse grupo, os funcionários que atendiam Bolsonaro e Michelle pediam a quitação de despesas da então primeira-dama e de parentes dela – e enviavam, em seguida, os comprovantes de pagamento.
        </p>
        <p>
            Em uma dessas mensagens, a assessora Giselle da Silva pede que Mauro Cid fizesse pagamentos mensais a Rosimary Cardoso Cordeiro – amiga de Michelle Bolsonaro.
        </p>
        <p>
            A Polícia Federal identificou seis depósitos do tipo para Rosimary, entre fevereiro e maio de 2021. Os valores somam R$ <say-as interpret-as="cardinal">10.133</say-as> e <say-as interpret-as="cardinal">6</say-as> centavos.
        </p>
        <p>
            A PF encontrou, ainda:
            <break time="500ms"/>
            <p>seis comprovantes de depósitos feitos por Mauro Cid diretamente para Michelle entre março e maio de 2021, com valor total de R$ <say-as interpret-as="cardinal">8.6</say-as> mil</p>
            <break time="500ms"/>
            <p>mais seis depósitos entre março e maio de 2021, totalizando R$ <say-as interpret-as="cardinal">8.520</say-as>, para Maria Helena Braga, que é casada com um tio de Michelle.</p>

        </p>
        </speak>

        This SSML document uses the following elements:

        - < speak > : The root element of the document that contains the text to be spoken¹.
        - < p > : A paragraph element that marks a paragraph boundary¹.
        - <break> : An element that inserts a pause or silence in the output speech¹. You can specify the duration of the pause using the time attribute¹.
        - < say - as > : An element that changes the way the text is spoken by specifying an interpret - as attribute¹. For example, you can use this element to speak numbers as cardinals or ordinals¹.

        Nunca incluir na resposta nada antes da tag <speak> ou depois da tag </speak>. Por exemplo, não iniciar a resposta com "Resposta é: "
        
        Esta é a pergunta que deve ser respondida: ${question}
        
        `

        try {
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 2000,
                temperature: 0.9
            });

            console.log("Reposta é: " + response.data.choices[0].text);
            let speakOutput = response.data.choices[0].text;
            speakOutput = speakOutput.replace(/<speak>/g, "<speak><voice name=\"Ricardo\">");
            speakOutput = speakOutput.replace(/<\/speak>/g, "</voice></speak>");
            speakOutput = speakOutput.replace(/Resposta é:/g, "");

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Posso ajudar com mais alguma coisa?')
                .getResponse();

        } catch (error) {
            console.log(error);

        }

    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Esta skill comunica com a API da OpenAI utilizando o modelo text-davinci-003';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Até logo!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `a primeira palavra citada não exprime uma pergunta, adicione a intenção na sua skill.' ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Desculpe, não consegui obter uma resposta. Tente de outra forma.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Desculpe, não consegui obter uma resposta para esta pergunta. Tente perguntar de outra forma.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChatGPTIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();

