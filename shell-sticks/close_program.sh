#!/bin/bash

# Step 1: Run the command to show buffers
output=$(solana program show --buffers)

# Step 2: Parse the first column (Buffer Address) and skip the header
buffer_addresses=($(echo "$output" | tail -n +2 | awk '{print $1}'))

# Step 3: Iterate through the buffer addresses and close each
for buffer in "${buffer_addresses[@]}"; do
  echo "Closing buffer: $buffer"
  
  # Try closing the buffer until the command succeeds
  while true; do
    solana program close "$buffer"
    if [ $? -eq 0 ]; then
      echo "Successfully closed buffer: $buffer"
      break
    else
      # Check the balance of the buffer address
      balance=$(solana balance "$buffer" | awk '{print $1}')
      if (( $(echo "$balance > 0" | bc -l) )); then
        echo "Failed to close buffer: $buffer. Retrying..."
      else
        echo "Buffer $buffer has insufficient balance ($balance SOL). Skipping..."
        break
      fi
      
      # Wait before retrying
      sleep 2
    fi
  done
done

echo "All buffers closed successfully!"

