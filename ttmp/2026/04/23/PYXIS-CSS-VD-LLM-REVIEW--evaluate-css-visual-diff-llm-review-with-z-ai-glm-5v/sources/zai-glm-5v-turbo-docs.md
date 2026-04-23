## Overview

GLM-5V-Turbo is Z.AI’s first **multimodal coding foundation model**, built for **vision-based coding tasks**. It can natively process multimodal inputs such as images, video, and text, while also excelling at long-horizon planning, complex coding, and action execution. **Deeply optimized for agent workflows**, it works seamlessly with agents such as Claude Code and OpenClaw to complete the full loop of “understand the environment → plan actions → execute tasks”.

## Positioning

Multimodal Coding Model

## Input Modality

Video / Image / Text / File

## Output Modality

Text

## Context Length

200K

## Maximum Output Tokens

128K

## Capability

## Thinking Mode

Offering multiple thinking modes for different scenarios

## Vision Comprehension

Powerful vision understanding capabilities, with support for images, video, and files

## Streaming Output

Support real-time streaming responses to enhance user interaction experience

## Function Call

Powerful tool invocation capabilities, enabling integration with various external toolsets

## Context Caching

Intelligent caching mechanism to optimize performance in long conversations

## Usage

Send a design mockup or reference image, and the model can directly understand the layout, color palette, component hierarchy, and interaction logic, then generate a complete runnable frontend project. For wireframes, it reconstructs structure and functionality; for high-fidelity designs, it aims for pixel-level visual consistency.

Works with frameworks such as Claude Code to autonomously browse target websites, map page transitions, collect visual assets and interaction details, and directly generate code based on the exploration results—upgrading from “recreating from a screenshot” to “recreating through autonomous exploration.”

Supports inputting screenshots of buggy pages, automatically identifying rendering issues such as layout misalignment, component overlap, and color mismatches, helping locate frontend problems and generate fix code to improve debugging efficiency.

After integrating GLM-5V-Turbo, OpenClaw can understand webpage layouts, GUI elements, and chart information, helping the agent handle complex real-world tasks that combine perception, planning, and execution.

## Resources

- [API Documentation](https://docs.z.ai/api-reference/llm/chat-completion): Learn how to call the API.

## Introducing GLM-5V-Turbo

## Official Skills

Beyond vision-based coding and Claw-style tasks, GLM-5V-Turbo also shows major gains in a broader range of agentic scenarios, including multimodal search, deep research, GUI agents, and perceptual grounding. To support these use cases, we provide a set of official Skills.

The ability to automatically analyze image content and generate natural-language descriptions; it can not only identify objects in an image, but also understand relationships between objects, scene atmosphere, and actions, turning them into accurate and fluent textual descriptions

The ability to precisely locate the corresponding object or region in an image based on a natural-language description; it establishes alignment between text and visual pixels, typically marking the target location with a bounding box, enabling more grounded interactions and assisting with fine-grained image analysis

The ability to understand and extract key information from user-provided documents (such as PDFs and Word files) and then generate text in a specified format; this ensures the output remains tightly grounded in the document content, making it useful for document interpretation, report generation, news writing, or proposal drafting

The ability to read candidate resumes and intelligently compare them against job requirements; it can quickly extract key information such as education, work experience, and skill tags, assess candidate-job fit, and provide rankings or recommendations, significantly improving recruiting efficiency

The ability to automatically generate high-quality, structured prompts based on reference images/videos and the user’s intended goal; by understanding the content and characteristics of the image/video, refining wording, and adding relevant detail, it produces instructions that are easier for AI models to follow, leading to more accurate and higher-quality image/video generation results

Additionally, based on the previously released specialized models GLM-OCR and GLM-Image, we have created five Skills to support a wider range of scenarios and tasks. The above Skills are now available on ClawHub, [Install Now](https://clawhub.ai/jaredforreal/glm-master-skill)!

## Examples

- Web Page Coding
- Website Generation
- Document Comprehension & Writing
- Video Object Tracking

## Input

![Description](https://cdn.bigmodel.cn/markdown/1774856146926image.png?attname=image.png)

Description

> Please recreate the mobile pages based on the design mockups in the images. The left side shows the welcome page, and the center shows the homepage image. You will also need to create mockups for the remaining two pages.

## Output

![Description](https://cdn.bigmodel.cn/markdown/1774856692508image.png?attname=image.png)

Description

## Quick Start

- cURL
- Python
- Java

**Basic Call**

```shellscript
curl -X POST \
    https://api.z.ai/api/paas/v4/chat/completions \
    -H "Authorization: Bearer your-api-key" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "glm-5v-turbo",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                        "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
                    }
                ]
            }
        ],
        "thinking": {
            "type":"enabled"
        }
    }'
```

**Streaming Call**

```shellscript
curl -X POST \
    https://api.z.ai/api/paas/v4/chat/completions \
    -H "Authorization: Bearer your-api-key" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "glm-5v-turbo",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                        "url": "https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format"
                    }
                ]
            }
        ],
        "thinking": {
            "type":"enabled"
        },
        "stream": true
    }'
```