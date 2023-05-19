const { Configuration, OpenAIApi } = require('openai');
const keys = require('./keys');

const configuration = new Configuration({
    apiKey: keys.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);
const question = "Escreva uma estória sobre um menino de 10 anos, chamado Arthur, que ama dinosauros e que tem um amigo imaginário chamado Bob.";

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
            <ul>
            <li>seis comprovantes de depósitos feitos por Mauro Cid diretamente para Michelle entre março e maio de 2021, com valor total de R$ <say-as interpret-as="cardinal">8.6</say-as> mil;</li>
            <li>mais seis depósitos entre março e maio de 2021, totalizando R$ <say-as interpret-as="cardinal">8.520</say-as>, para Maria Helena Braga, que é casada com um tio de Michelle.</li>
            </ul>
        </p>
        </speak>

        This SSML document uses the following elements:

        - < speak > : The root element of the document that contains the text to be spoken¹.
        - < p > : A paragraph element that marks a paragraph boundary¹.
        - <break> : An element that inserts a pause or silence in the output speech¹. You can specify the duration of the pause using the time attribute¹.
        - < say - as > : An element that changes the way the text is spoken by specifying an interpret - as attribute¹. For example, you can use this element to speak numbers as cardinals or ordinals¹.
        - < ul >  and  < li > : Elements that mark an unordered list and a list item respectively¹. These elements can help structure the text and add appropriate pauses between items¹.

        Nunca incluir na resposta nada antes da tag <speak> ou depois da tag </speak>. Por exemplo, não iniciar a resposta com "Resposta é: "
        
        Esta é a pergunta que deve ser respondida: ${question}
        
        `

const start = performance.now();

try {
    const response = openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.9,
        
    }).then((response) => {
                const end = performance.now();
                // console.log("Resposta é: " + response.data.choices[0].text);
                console.log("Tempo de execução: " + (end - start) / 1000 + " segundos");

                let resposta = response.data.choices[0].text;
                resposta = resposta.replace(/<speak>/g, "<speak><voice name=\"Ricardo\">");
                resposta = resposta.replace(/<\/speak>/g, "</voice></speak>");
                resposta = resposta.replace(/Resposta é:/g, "");

                //elimar os espaços em branco no início e no final da resposta
                resposta = resposta.trim();

                console.log(resposta);

            }).catch((error) => {
                console.log(error);
            });

} catch (error) {
    console.log(error);

}