POST

/

paas

/

v4

/

chat

/

completions

#### AuthorizationsAuthorization

string

header

required

Use the following format for authentication: Bearer

#### HeadersAccept-Language

enum<string>

default:en-US,en

Config desired response language for HTTP requests.

Available options:

`en-US,en`

Example:

`"en-US,en"`

#### Body

application/jsonmodel

enum<string>

default:glm-5.1

required

The model code to be called. GLM-5.1, GLM-5, GLM-5-Turbo are the latest flagship model series, foundational models specifically designed for agent applications.

Available options:

`glm-5.1`,

`glm-5-turbo`,

`glm-5`,

`glm-4.7`,

`glm-4.7-flash`,

`glm-4.7-flashx`,

`glm-4.6`,

`glm-4.5`,

`glm-4.5-air`,

`glm-4.5-x`,

`glm-4.5-airx`,

`glm-4.5-flash`,

`glm-4-32b-0414-128k`

Example:

`"glm-5.1"`messages

(User Message · object | System Message · object | Assistant Message · object | Tool Message · object)\[\]

required

The current conversation message list as the model’s prompt input, provided in JSON array format, e.g.,`{“role”: “user”, “content”: “Hello”}`. Possible message types include system messages, user messages, assistant messages, and tool messages. Note: The input must not consist of system messages or assistant messages only.

Minimum array length: `1`messages.role

enum<string>

default:user

required

Role of the message author

Available options:

`user`messages.content

string

required

Text message content

Example:

`"What opportunities and challenges will the Chinese large model industry face in 2025?"`request\_id

string

Passed by the user side, needs to be unique; used to distinguish each request. If not provided by the user side, the platform will generate one by default.do\_sample

boolean

default:true

When do\_sample is true, sampling strategy is enabled; when do\_sample is false, sampling strategy parameters such as temperature and top\_p will not take effect. Default value is `true`.

Example:

`true`stream

boolean

default:false

This parameter should be set to false or omitted when using synchronous call. It indicates that the model returns all content at once after generating all content. Default value is false. If set to true, the model will return the generated content in chunks via standard Event Stream. When the Event Stream ends, a `data: [DONE]` message will be returned.

Example:

`false`thinking

object

Only supported by GLM-4.5 series and higher models. This parameter is used to control whether the model enable the chain of thought.thinking.type

enum<string>

default:enabled

Whether to enable the chain of thought(When enabled, GLM-5.1 GLM-5 GLM-5-Turbo GLM-5V-Turbo GLM-4.7 GLM-4.5V will think compulsorily, while GLM-4.6, GLM-4.6V, GLM-4.5 and others will automatically determine whether to think), default: enabled

Available options:

`enabled`,

`disabled`thinking.clear\_thinking

boolean

default:true

Default value is True. Controls whether to clear `reasoning_content` from previous conversation turns. View more in [Thinking Mode](https://docs.z.ai/guides/capabilities/thinking-mode).

- `true` (default): For this request, the system ignores/removes `reasoning_content` from prior turns, and only keeps non-reasoning context (e.g., user/assistant visible text, tool calls, and tool results). This is recommended for general chat or lightweight tasks to reduce context length and cost.
- `false`: Retains `reasoning_content` from prior turns and includes it in the context sent to the model. To enable Preserved Thinking, you must forward the full, unmodified, and correctly ordered historical `reasoning_content` in `messages`. Missing, truncated, rewritten, or reordered blocks may degrade performance or prevent the feature from taking effect.
- Notes: This parameter only affects cross-turn historical thinking blocks; it does not change whether the model generates/returns thinking in the current turn.

Example:

`true`temperature

number<float>

default:1

Sampling temperature, controls the randomness of the output, must be a positive number within the range: `[0.0, 1.0]`. The GLM-5.1, GLM-5, GLM-4.7, GLM-4.6 series default value is `1.0`, GLM-4.5 series default value is `0.6`, GLM-4-32B-0414-128K default value is `0.75`.

Required range: `0 <= x <= 1`

Example:

`1`top\_p

number<float>

default:0.95

Another method of temperature sampling, value range is: `[0.01, 1.0]`. The GLM-5.1, GLM-5, GLM-4.7, GLM-4.6, GLM-4.5 series default value is `0.95`, GLM-4-32B-0414-128K default value is `0.9`.

Required range: `0.01 <= x <= 1`

Example:

`0.95`max\_tokens

integer

The maximum number of tokens for model output, the GLM-5.1, GLM-5, GLM-4.7, GLM-4.6 series supports 128K maximum output, the GLM-4.5 series supports 96K maximum output, the GLM-4.6v series supports 32K maximum output, the GLM-4.5v series supports 16K maximum output, GLM-4-32B-0414-128K supports 16K maximum output.

Required range: `1 <= x <= 131072`

Example:

`1024`tool\_stream

boolean

default:false

Whether to enable streaming response for Function Calls. Default value is false. Only supported by GLM-4.6 and above. Refer the [Stream Tool Call](https://docs.z.ai/guides/tools/stream-tool)

Example:

`false`tools

(Function Call · object | Retrieval · object | Web Search · object)\[\]

A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.tools.type

enum<string>

default:function

required

Available options:

`function`tools.function

object

requiredtools.function.name

string

required

The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.

Required string length: `1 - 64`

Pattern: `^[a-zA-Z0-9_-]+$`tools.function.description

string

required

A description of what the function does, used by the model to choose when and how to call the function.tools.function.parameters

object

required

Parameters defined using JSON Schema. Must pass a JSON Schema object to accurately define accepted parameters. Omit if no parameters are needed when calling the function.tool\_choice

enum<string>

Controls how the model selects a tool.

Available options:

`auto`stop

string\[\]

Stop word list. Generation stops when the model encounters any specified string. Currently, only one stop word is supported, in the format \["stop\_word1"\].

Maximum array length: `1`response\_format

object

Specifies the response format of the model. Defaults to text. Supports two formats:{ "type": "text" } plain text mode, returns natural language text, { "type": "json\_object" } JSON mode, returns valid JSON data. When using JSON mode, it’s recommended to clearly request JSON output in the prompt.response\_format.type

enum<string>

default:text

required

Output format type: text for plain text, json\_object for JSON-formatted output.

Available options:

`text`,

`json_object`user\_id

string

Unique ID for the end user, 6–128 characters. Avoid using sensitive information.

Required string length: `6 - 128`

#### Response

Processing successfulid

string

Task IDrequest\_id

string

Request IDcreated

integer

Request creation time, Unix timestamp in secondsmodel

string

Model namechoices

object\[\]

List of model responseschoices.index

integer

Result index.choices.message

objectchoices.message.role

string

Current conversation role, default is ‘assistant’ (model)

Example:

`"assistant"`choices.message.content

string

Current conversation content. Hits function is null, otherwise returns model inference result. For the GLM-4.5V series models, the output may contain the reasoning process tags `<think> </think>` or the text boundary tags `<|begin_of_box|> <|end_of_box|>`.choices.message.reasoning\_content

string

Reasoning content, supports by GLM-4.5 series.choices.message.tool\_calls

object\[\]

Function names and parameters generated by the model that should be called.choices.message.tool\_calls.function

object

Contains the function name and JSON format parameters generated by the model.choices.message.tool\_calls.function.name

string

required

Model-generated function name.choices.message.tool\_calls.function.arguments

object

required

JSON format of the function call parameters generated by the model. Validate the parameters before calling the function.choices.message.tool\_calls.id

string

Unique identifier for the hit function.choices.message.tool\_calls.type

string

Tool type called by the model, currently only supports ‘function’.choices.finish\_reason

string

Reason for model inference termination. Can be `stop`, `tool_calls`, `length`, `sensitive`, `model_context_window_exceeded` or `network_error`.usage

object

Token usage statistics returned when the model call ends.usage.prompt\_tokens

number

Number of tokens in user inputusage.completion\_tokens

number

Number of output tokensusage.prompt\_tokens\_details

objectusage.prompt\_tokens\_details.cached\_tokens

number

Number of tokens served from cacheusage.total\_tokens

integer

Total number of tokens

[Rate Limits](https://docs.z.ai/api-reference/rate-limit) [Generate Image](https://docs.z.ai/api-reference/image/generate-image)