function GenerateText(prompt: string, system_prompt: string, force_json: bool) -> string {
  client CustomGPT5Mini
  prompt #"
    System instructions:
    {{ system_prompt }}

    User prompt:
    {{ prompt }}

    {% if force_json %}
    IMPORTANT: Return valid JSON only. Do not include markdown or extra prose.
    {% endif %}
  "#
}

test generate_text {
  functions [GenerateText]
  args {
    prompt "Generate a JSON object with key status"
    system_prompt "You are a strict JSON assistant"
    force_json true
  }
}
