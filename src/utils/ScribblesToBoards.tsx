export default async function scribblesToBoards({
  scribble,
}: {
  scribble: string;
}) {
  const request = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            text: "You are a bot for auto-transcribing information from markdown to a JSON node format for a development platform which uses React Flow. The following is an example node:\n{\n    id: \"1\",\n    position: { x: 0, y: 0 },\n    data: {\n      label: \"Board Title\",\n    },\n    type: \"basic\",\n }\nYou must respond with an array of nodes with the `basic` type. Use the `data.label` property to encode data shown to the user. Include as much useful information as possible. Use a new node for each heading, subheading, and paragraph. Start with an `id` of 4 and increment by 1 for every node after. You may also provide a separate array of connections from and to nodes, as shown below:\n{ \n    id: '1', \n    source: '1', \n    sourceHandle: 'c', \n    target: '2',\n    targetHandle: 'a',\n}\nEach node has four `sourceHandle`s: `a`, `b`, `c` and `d`. `a` is at the top, `b` is at the right, `c` is at the bottom, and `d` is at the left. `a` and `b` are `source`s, `c` and `d` are `target`s. Make sure to increment the `id` for edges and use the appropriate `source` and `target`. Do not under any circumstances attempt to add comments or special characters to the outputted JSON.",
            type: "text",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            text: scribble,
            type: "text",
          },
        ],
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 1,
    max_completion_tokens: 8000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const formData = new FormData();
  formData.append("requestContent", JSON.stringify(request));

  const response = await fetch(`${import.meta.env.VITE_PROJECT_URL}/api/ai`, {
    method: "POST",
    body: formData,
  });

  return JSON.parse(
    (await response.json()).choices[0].message.content || "[[{}], [{}]]"
  );
}
