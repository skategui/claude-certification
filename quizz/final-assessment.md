# Final Assessment

## Question 1

What is a tool function in the context of Claude's tool use system?

- [ ] A special API endpoint provided by Anthropic
- [ ] A configuration file that defines Claude's behavior
- [ ] A database query that retrieves user preferences
- [x] A plain function that gets executed when Claude needs additional information or needs to perform an action

## Question 2

You're improving a prompt that isn't working well. What should you do after applying a prompt engineering technique?

- [ ] Start over with a completely new prompt
- [ ] Ask someone else to write the prompt
- [x] Use prompt evaluations to see if it actually improved
- [ ] Move on to the next technique immediately

## Question 3

You're making a math tutoring app. You want Claude to give hints instead of direct answers. What should you use?

- [ ] Ask users to say "please" in every question
- [ ] Use smaller fonts to make Claude quiet
- [ ] Send messages only on weekdays
- [x] A system prompt explaining Claude should act like a tutor

## Question 4

You want Claude to write very creative, unpredictable stories. What temperature setting should you use?

- [ ] 0.5 (medium)
- [ ] 0.0 (very low)
- [ ] Temperature doesn't affect creativity
- [x] 1.0 (very high)

## Question 5

You want an AI to write a product description. Which opening is most clear and direct?

- [ ] "I was wondering if you could maybe help me with something about products?"
- [ ] "Can you tell me about products and descriptions and stuff?"
- [x] "Write a product description for running shoes."
- [ ] "What do you think makes a good product description?"

## Question 6

You want to measure how well your AI prompt actually works in practice. Which approach should you focus on?

- [ ] Using multishot prompting examples
- [ ] Prompt engineering techniques like XML tags
- [ ] Writing longer, more detailed prompts
- [x] Prompt evaluation with automated testing

## Question 7

You're building a web app that talks to Claude. Where should you store your API key?

- [x] On your server, hidden from users
- [ ] In a public GitHub repository
- [ ] In the web browser's settings
- [ ] In your website's JavaScript code

## Question 8

What is a model grader in prompt evaluation?

- [ ] A human reviewer who manually scores AI outputs
- [x] Another AI model used to assess the quality of outputs
- [ ] A programmatic check that validates syntax and format
- [ ] A scoring system that only measures response speed

## Question 9

You're asking an AI to analyze both customer reviews and sales data. How should you organize this information in your prompt?

- [ ] Put reviews first, then sales data with no separators
- [ ] Mix everything together in one paragraph
- [ ] Write the data in different fonts
- [x] Use XML tags like <reviews> and <sales_data> to separate them

## Question 10

You want to send a message to Claude through the API. Which four things do you absolutely need to include?

- [ ] Temperature, creativity, speed, and language
- [ ] Date, time, location, and device type
- [x] API key, model name, messages, and max tokens
- [ ] Username, password, email, and phone number

## Question 11

What is the primary purpose of tool use in Claude?

- [ ] To automatically save conversation history
- [x] To allow Claude to access real-time information and external systems beyond its training data
- [ ] To make Claude respond faster to user queries
- [ ] To reduce the number of tokens Claude uses in responses

## Question 12

You're running a prompt evaluation. After getting responses from Claude, what's the next step in the typical workflow?

- [ ] Rewrite the prompt completely from scratch
- [ ] Create a new dataset with different questions
- [ ] Deploy the prompt to production immediately
- [x] Feed the responses through a grader for scoring

## Question 13

You ask Claude "What is pizza?" and it answers. Then you ask "What toppings are popular?" but Claude doesn't know you're still talking about pizza. What's the problem?

- [x] You need to send the whole conversation history with each request
- [ ] Claude doesn't like pizza
- [ ] Claude is broken
- [ ] You're asking too many questions

## Question 14

What is the primary difference between an MCP Server and an MCP Client in terms of their roles?

- [x] MCP Servers contain tools, prompts, and resources while MCP Clients act as the communication bridge to access those tools
- [ ] MCP Servers handle user authentication while MCP Clients manage permissions
- [ ] MCP Servers store data while MCP Clients process requests
- [ ] MCP Servers run on remote machines while MCP Clients only run locally

## Question 15

Which of the following best describes Computer Use in the context of Claude?

- [ ] A method for deploying Claude applications to cloud servers
- [ ] A billing system that tracks how much computational time Claude consumes
- [x] A capability that lets Claude interact directly with desktop environments like a human would
- [ ] A feature that optimizes Claude's processing speed on different hardware

## Question 16

What does "transport agnostic" mean in the context of MCP communication?

- [x] MCP clients and servers can communicate using different methods like HTTP or standard input/output
- [ ] MCP only works with encrypted connections
- [ ] MCP automatically chooses the fastest available network connection
- [ ] MCP requires specific hardware to function properly

## Question 17

What is the primary purpose of a batch tool in Claude's tool system?

- [x] To accept multiple tool calls and execute them simultaneously
- [ ] To encrypt multiple tool calls for security purposes
- [ ] To process large files that exceed normal size limits
- [ ] To automatically retry failed tool calls

## Question 18

Claude responds to your request with both explanatory text and a tool use block. What type of message structure is this?

- [ ] An error message that needs to be fixed
- [x] A multi-block message with different content types
- [ ] A single-block text message
- [ ] A malformed response that should be ignored

## Question 19

You're building an app where users need to verify information Claude provides from documents. What feature should you enable?

- [ ] Code execution
- [ ] Prompt caching
- [x] Citations
- [ ] Extended thinking

## Question 20

When should you choose workflows over agents for handling user tasks?

- [ ] When you're not sure what tasks or parameters you'll give to Claude
- [ ] When you need maximum flexibility in task completion
- [ ] When you want Claude to creatively combine tools in unexpected ways
- [x] When you can picture the exact flow or steps Claude should go through to solve a problem

## Question 21

Which of the following best describes why environment inspection is crucial for AI agents?

- [ ] It helps agents run faster and more efficiently
- [x] It allows agents to observe and understand the results of their actions
- [ ] It simplifies the agent's tool requirements
- [ ] It reduces the cost of running AI operations

## Question 22

What is the Model Context Protocol (MCP)?

- [ ] A security protocol for protecting AI model parameters
- [x] A communication layer that provides Claude with context and tools without requiring tedious integration code
- [ ] A programming language designed specifically for AI applications
- [ ] A database system for storing AI training data

## Question 23

You keep sending the same long document to Claude with different questions. How can you make this faster and cheaper?

- [ ] Compress the document first
- [ ] Split the document into smaller pieces
- [x] Use prompt caching with cache breakpoints
- [ ] Ask multiple questions at once
