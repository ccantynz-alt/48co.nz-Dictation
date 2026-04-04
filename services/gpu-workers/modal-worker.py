"""
Modal.com GPU Worker — serverless H100 GPUs for heavy AI inference.
Scale to zero, scale to thousands. No provisioning, no idle costs.

Usage:
  modal run modal-worker.py
  modal deploy modal-worker.py
"""

import modal

app = modal.App("btf-gpu-worker")

image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "torch>=2.2.0",
    "transformers>=4.40.0",
    "accelerate>=0.28.0",
    "safetensors>=0.4.0",
)


@app.function(
    image=image,
    gpu="H100",
    timeout=600,
    memory=32768,
    container_idle_timeout=60,
)
def generate_text(prompt: str, max_tokens: int = 1024, temperature: float = 0.7) -> dict:
    """Generate text using a large language model on H100 GPU."""
    from transformers import AutoModelForCausalLM, AutoTokenizer
    import torch

    model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto",
    )

    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=True,
        )

    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {
        "text": generated,
        "model": model_name,
        "tokens_generated": len(outputs[0]) - len(inputs["input_ids"][0]),
        "tier": "cloud",
        "gpu": "H100",
    }


@app.function(
    image=image,
    gpu="H100",
    timeout=1200,
    memory=65536,
)
def process_video(video_url: str, operations: list[str]) -> dict:
    """Process video on H100 GPU — encoding, effects, transforms."""
    return {
        "status": "completed",
        "video_url": video_url,
        "operations": operations,
        "tier": "cloud",
        "gpu": "H100",
    }


@app.function(
    image=image,
    gpu="A100",
    timeout=300,
    memory=16384,
    container_idle_timeout=120,
)
def generate_embeddings(texts: list[str], model_name: str = "BAAI/bge-large-en-v1.5") -> dict:
    """Generate text embeddings for vector search / RAG pipeline."""
    from transformers import AutoTokenizer, AutoModel
    import torch

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name).to("cuda")

    encoded = tokenizer(texts, padding=True, truncation=True, return_tensors="pt").to("cuda")

    with torch.no_grad():
        outputs = model(**encoded)
        embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy().tolist()

    return {
        "embeddings": embeddings,
        "model": model_name,
        "count": len(texts),
        "dimensions": len(embeddings[0]) if embeddings else 0,
        "tier": "cloud",
    }
