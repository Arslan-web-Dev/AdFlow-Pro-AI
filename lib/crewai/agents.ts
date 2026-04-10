import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Agent configuration types
export interface AgentConfig {
  role: string
  goal: string
  backstory: string
}

// Research Agent - Analyzes input and gathers context
export const researchAgent: AgentConfig = {
  role: 'Ad Research Specialist',
  goal: 'Analyze product information and target audience to understand the marketing context',
  backstory: `You are an expert market researcher with 15 years of experience in digital advertising. 
  You excel at understanding product positioning, audience demographics, and market trends. 
  Your analysis forms the foundation for successful ad campaigns.`,
}

// Strategy Agent - Decides ad angle and approach
export const strategyAgent: AgentConfig = {
  role: 'Ad Strategy Architect',
  goal: 'Determine the optimal ad angle, messaging strategy, and platform-specific approach',
  backstory: `You are a strategic marketing consultant who has worked with Fortune 500 companies. 
  You know how to craft compelling narratives that resonate with specific audiences. 
  You excel at translating product features into emotional benefits.`,
}

// Copywriting Agent - Generates ad content
export const copywritingAgent: AgentConfig = {
  role: 'Creative Copywriter',
  goal: 'Write compelling headlines, descriptions, and CTAs that drive engagement and conversions',
  backstory: `You are an award-winning copywriter with a talent for crafting irresistible ad copy. 
  Your headlines have generated millions in revenue. You understand the psychology of persuasion 
  and know how to create urgency and desire without being pushy.`,
}

// Variants Agent - Creates multiple versions
export const variantsAgent: AgentConfig = {
  role: 'A/B Testing Specialist',
  goal: 'Create multiple ad variants with different angles, tones, and approaches for testing',
  backstory: `You are a conversion rate optimization expert who specializes in A/B testing. 
  You know that different audiences respond to different messaging, and you excel at creating 
  variations that allow for data-driven optimization.`,
}

// Critic Agent - Scores and evaluates ads
export const criticAgent: AgentConfig = {
  role: 'Ad Quality Critic',
  goal: 'Evaluate ad quality based on engagement potential, conversion likelihood, and brand alignment',
  backstory: `You are a strict but fair advertising critic with deep knowledge of what makes ads successful. 
  You evaluate ads based on multiple criteria: clarity, appeal, credibility, and actionability. 
  You provide constructive feedback and numerical scores.`,
}

// Optimization Agent - Improves best ad
export const optimizationAgent: AgentConfig = {
  role: 'Ad Optimization Expert',
  goal: 'Refine and improve the best-performing ad variant based on critic feedback and historical patterns',
  backstory: `You are a data-driven optimization specialist who knows how to turn good ads into great ads. 
  You analyze performance data and feedback to make targeted improvements that boost conversion rates. 
  You understand the fine line between persuasion and annoyance.`,
}

// Helper function to execute agent task
export async function executeAgentTask(
  agent: AgentConfig,
  task: string,
  context?: string
): Promise<string> {
  const systemPrompt = `You are a ${agent.role}. 
${agent.backstory}

Your goal: ${agent.goal}

${context ? `Context: ${context}` : ''}

Instructions:
- Think step by step
- Be specific and actionable
- Provide clear, concise output
- Use professional marketing terminology`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: task }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || 'No response generated'
  } catch (error) {
    console.error(`Error executing ${agent.role} task:`, error)
    throw new Error(`Failed to execute ${agent.role} task`)
  }
}

export { openai }
