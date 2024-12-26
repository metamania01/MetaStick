#!/usr/bin/env rust-script
//! ```cargo
//! [dependencies]
//! solana-client = "1.17"
//! solana-sdk = "1.17"
//! solana-account-decoder = "1.17"
//! anyhow = "1.0"
//! chrono = "0.4"
//! hex = "0.4"
//! bs58 = "0.4"
//! dotenv = "0.15"
//! ```

use std::collections::{HashMap, HashSet};
use std::env;
use std::io;
use std::str::FromStr;
use std::thread;
use std::time::Duration;

use anyhow::Result;
use chrono::{DateTime, Utc};
use solana_account_decoder::UiAccountEncoding;
use solana_client::rpc_client::GetConfirmedSignaturesForAddress2Config;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig};
use solana_sdk::pubkey::Pubkey;

struct AccountFetcher {
    clients: Vec<RpcClient>,
    program_id: Pubkey,
    current_client: usize,
}

impl AccountFetcher {
    fn new(program_id: &str) -> Result<Self> {
        // Initialize with multiple RPC endpoints for redundancy
        let rpc_urls = vec![
            "https://burned-young-snowflake.solana-mainnet.quiknode.pro/96e3f49289f987ccdd62dacc40990b20bd21f5ad/",
            "https://skilled-sly-choice.solana-mainnet.quiknode.pro/5db92b766fd9b7ec4cc7e89101473c1d579aa98a/",
            "https://aged-billowing-firefly.solana-mainnet.quiknode.pro/714c2bc2cba308a8c5fe4aee343d31b83b9f42d1/",
            "https://distinguished-dry-sea.solana-mainnet.quiknode.pro/79528918b82740044a48a73406c3139caf8e729d/",
            "https://solitary-yolo-ensemble.solana-mainnet.quiknode.pro/82fe22445068e050d80b27275910aa62734e2520/",
            "https://summer-orbital-gas.solana-mainnet.quiknode.pro/dff876e9e6cb916bc741a761367a91f50ff5dd92/",
            "https://serene-cosmopolitan-arrow.solana-mainnet.quiknode.pro/e5024a662e59587220837fbb749fe7cce477ca09/",
            "https://neat-snowy-bird.solana-mainnet.quiknode.pro/14c0721161ba1af1c4ef91b0a568e2b24edeb9c5/",
            "https://api.mainnet-beta.solana.com",
            "https://solana-api.projectserum.com",
            "https://rpc.ankr.com/solana",
            "https://mainnet.rpcpool.com",
        ];

        let clients = rpc_urls.into_iter()
            .map(RpcClient::new)
            .collect();

        let program_id = Pubkey::from_str(program_id)?;
        
        Ok(Self {
            clients,
            program_id,
            current_client: 0,
        })
    }
    
    fn get_client(&mut self) -> (&RpcClient, Pubkey) {
        let client = &self.clients[self.current_client];
        self.current_client = (self.current_client + 1) % self.clients.len();
        (client, self.program_id)
    }
    
    fn get_all_accounts(&mut self) -> Result<Vec<(Pubkey, Vec<u8>)>> {
        for _ in 0..self.clients.len() {
            let (client, program_id) = self.get_client();
            
            match client.get_program_accounts_with_config(
                &program_id,
                RpcProgramAccountsConfig {
                    filters: None,
                    account_config: RpcAccountInfoConfig {
                        encoding: Some(UiAccountEncoding::Base64),
                        data_slice: None,
                        commitment: None,
                        min_context_slot: None,
                    },
                    with_context: Some(true),
                },
            ) {
                Ok(accounts) => {
                    return Ok(accounts
                        .into_iter()
                        .map(|(pubkey, account)| (pubkey, account.data))
                        .collect());
                }
                Err(e) => {
                    println!("Error with RPC {}: {}", self.current_client, e);
                    continue;
                }
            }
        }
        
        Err(anyhow::anyhow!("All RPC endpoints failed"))
    }
}

fn print_intro(program_id: &str) {
    println!("
╔════════════════════════════════════════════════╗
║                   S P A D E                    ║
║      Solana Program Account Data Explorer      ║
║                                               ║
║  Program ID: {}  ║
║                                               ║
║  Features:                                     ║
║  • Account Analysis & Structure Detection      ║
║  • Cross-Reference Mapping                     ║
║  • Historical Data Analysis                    ║
║  • Pattern Detection & Size Analysis           ║
║                                               ║
║  Version: 1.0.0                               ║
╚════════════════════════════════════════════════╝
", program_id);
}

fn get_analysis_description(choice: &str) -> &'static str {
    match choice {
        "1" => "Basic account analysis provides an overview of all accounts in the program, \
                including total count, size distribution, and general statistics.",
        "2" => "Large account analysis focuses on accounts exceeding a specified size, \
                helping identify data-heavy accounts and their structure.",
        "3" => "Specific size analysis allows you to examine accounts of an exact size, \
                useful for finding accounts with similar structures.",
        "4" => "Account type analysis groups accounts by their discriminator, \
                helping identify different account types used in the program.",
        "5" => "Pattern search lets you find specific byte patterns across all accounts, \
                useful for locating specific data or structures.",
        "6" => "Specific account analysis provides detailed information about a single account, \
                including creation time, references, and data structure.",
        "7" => "Zero bytes analysis examines the distribution of zero bytes in accounts, \
                helping identify unused space and patterns.",
        "8" => "Cross-reference analysis maps relationships between accounts, \
                showing how accounts are connected within the program.",
        "9" => "Account age analysis shows the timeline of account creation, \
                helping understand the program's growth and usage patterns.",
        _ => "Invalid choice"
    }
}

fn analyze_account_basic(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n📊 BASIC ACCOUNT ANALYSIS");
    println!("=======================");
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts", accounts.len());
    println!("Total accounts found: {}\n", accounts.len());
    
    let mut size_distribution = HashMap::new();
    
    for (_, data) in &accounts {
        *size_distribution.entry(data.len()).or_insert(0) += 1;
    }
    
    println!("Size distribution:");
    for (size, count) in size_distribution.iter() {
        println!("- Size {} bytes: {} accounts", size, count);
    }
    
    println!("\n##########################Press Enter to continue...##########################");
    let mut wait = String::new();
    io::stdin().read_line(&mut wait)?;
    
    Ok(())
}

fn analyze_large_accounts(fetcher: &mut AccountFetcher, show_offsets: bool) -> Result<()> {
    println!("\nEnter minimum size in bytes (default: 2000):");
    let mut size_input = String::new();
    io::stdin().read_line(&mut size_input)?;
    
    let min_size = size_input.trim().parse::<usize>().unwrap_or(2000);
    
    println!("\n🔍 LARGE ACCOUNT ANALYSIS (>{} bytes)", min_size);
    println!("====================================");
    let all_accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts\n", all_accounts.len());
    
    for (pubkey, data) in &all_accounts {
        if data.len() > min_size {
            println!("Account: {}", pubkey);
            println!("Size: {} bytes", data.len());
            println!("First 32 bytes: {:?}\n", &data[..32]);
            
            if show_offsets {
                println!("Offset analysis:");
                for (i, chunk) in data.chunks(32).enumerate() {
                    let key_str = bs58::encode(chunk).into_string();
                    println!("Offset {}: {}", i * 32, key_str);
                }
                println!();
            }
        }
    }
    
    Ok(())
}

fn analyze_specific_size(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\nEnter exact size in bytes to analyze (e.g., 377):");
    let mut size_input = String::new();
    io::stdin().read_line(&mut size_input)?;
    
    let target_size = size_input.trim().parse::<usize>()?;
    
    println!("\n🎯 SPECIFIC SIZE ANALYSIS ({} bytes)", target_size);
    println!("====================================");
    
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts", accounts.len());
    
    let specific_accounts: Vec<_> = accounts.iter()
        .filter(|(_, data)| data.len() == target_size)
        .collect();
    
    println!("Found {} accounts of size {} bytes\n", specific_accounts.len(), target_size);
    
    for (pubkey, data) in specific_accounts {
        println!("📝 Account: {}", pubkey);
        println!("Size: {} bytes", data.len());
        println!("First 32 bytes: {:?}\n", &data[..32]);
        
        println!("Offset analysis:");
        for (i, chunk) in data.chunks(32).enumerate() {
            let key_str = bs58::encode(chunk).into_string();
            println!("Offset {}: {}", i * 32, key_str);
        }
    }
    
    Ok(())
}

fn analyze_account_types(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🏷️  ACCOUNT TYPE ANALYSIS");
    println!("=======================");
    
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts\n", accounts.len());
    
    let mut type_groups: HashMap<Vec<u8>, Vec<(Pubkey, Vec<u8>)>> = HashMap::new();
    
    // Group accounts by their discriminator
    for (pubkey, data) in accounts {
        if data.len() >= 8 {
            let discriminator = data[..8].to_vec();
            type_groups.entry(discriminator)
                .or_default()
                .push((pubkey, data));
        }
    }
    
    println!("Found {} different account types\n", type_groups.len());
    
    // Analyze each type
    for (discriminator, accounts) in &type_groups {
        // Format discriminator without quotes and commas between hex values
        let disc_str = discriminator.iter()
            .map(|b| format!("{:02x}", b))
            .collect::<Vec<_>>()
            .join(", ");
        println!("📌 Account Type: [{}]", disc_str);
        println!("Count: {} accounts", accounts.len());
        
        // Get unique sizes
        let sizes: HashSet<_> = accounts.iter().map(|(_, data)| data.len()).collect();
        println!("Sizes: {:?}\n", sizes);
        
        // Show example accounts
        println!("Example accounts:");
        for (pubkey, data) in accounts.iter().take(3) {
            println!("- {} ({} bytes)", pubkey, data.len());
            println!("  First 32 bytes: [{:02x?}]", &data[..32].iter().map(|b| format!("{:02x}", b)).collect::<Vec<_>>().join(", "));
        }
        println!("---\n");
    }
    
    Ok(())
}

fn search_pattern(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🔍 DATA PATTERN SEARCH");
    println!("Enter hex pattern to search (e.g., 0102):");
    let mut pattern = String::new();
    io::stdin().read_line(&mut pattern)?;
    
    let pattern_bytes = hex::decode(pattern.trim())?;
    let accounts = fetcher.get_all_accounts()?;
    
    let mut matches_found = 0;
    println!("\nSearching {} accounts...", accounts.len());
    
    for (pubkey, data) in accounts {
        let mut account_matches = false;
        for (i, window) in data.windows(pattern_bytes.len()).enumerate() {
            if window == pattern_bytes {
                if !account_matches {
                    matches_found += 1;
                    account_matches = true;
                }
                println!("Found in account {} at offset {}", pubkey, i);
            }
        }
    }
    
    if matches_found == 0 {
        println!("\n❌ No matches found in any accounts");
    } else {
        println!("\n✅ Pattern found in {} accounts", matches_found);
    }
    
    Ok(())
}

fn search_specific_account(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🔍 SPECIFIC ACCOUNT ANALYSIS");
    println!("Enter account address:");
    let mut addr_input = String::new();
    io::stdin().read_line(&mut addr_input)?;
    
    let search_pubkey = Pubkey::from_str(addr_input.trim())?;
    
    let accounts = fetcher.get_all_accounts()?;
    let (client, _) = fetcher.get_client();
    
    if let Some((_, data)) = accounts.iter().find(|(pubkey, _)| *pubkey == search_pubkey) {
        println!("\nAccount found!");
        println!("Size: {} bytes", data.len());
        println!("First 32 bytes: {:?}", &data[..32]);
        
        println!("\nFetching account history...");
        let config = GetConfirmedSignaturesForAddress2Config {
            before: None,
            until: None,
            limit: Some(1),
            commitment: None,
        };
        
        match client.get_signatures_for_address_with_config(&search_pubkey, config) {
            Ok(signatures) => {
                if let Some(oldest_sig) = signatures.last() {
                    let block_time = oldest_sig.block_time.unwrap_or(0);
                    let datetime = DateTime::<Utc>::from_timestamp(block_time as i64, 0)
                        .unwrap_or_default()
                        .format("%Y-%m-%d %H:%M:%S")
                        .to_string();
                    
                    println!("\n📅 Creation Time: {}", datetime);
                    println!("🔗 First Transaction: {}", oldest_sig.signature);
                }
            }
            Err(e) => {
                println!("Failed to get account history: {}", e);
            }
        }
        
        println!("\n🔄 Cross References Analysis:");
        println!("==========================");
        
        let mut references_to = Vec::new();
        let mut referenced_by = Vec::new();
        
        // Look for references from our account to others
        for (offset, window) in data.windows(32).enumerate() {
            if let Ok(ref_pubkey) = Pubkey::try_from(window) {
                // Check if this pubkey belongs to any program account
                if accounts.iter().any(|(p, _)| p == &ref_pubkey) && ref_pubkey != search_pubkey {
                    references_to.push((ref_pubkey, offset * 32));
                }
            }
        }
        
        // Look for references to our account in other accounts
        for (other_pubkey, other_data) in &accounts {
            if other_pubkey != &search_pubkey {  // Skip self
                for (offset, window) in other_data.windows(32).enumerate() {
                    if let Ok(ref_pubkey) = Pubkey::try_from(window) {
                        if ref_pubkey == search_pubkey {
                            referenced_by.push((*other_pubkey, offset * 32));
                        }
                    }
                }
            }
        }
        
        if !references_to.is_empty() {
            println!("\n📤 This account references these program accounts:");
            for (pubkey, offset) in references_to {
                println!("  → {} (at offset {})", pubkey, offset);
            }
        } else {
            println!("\n📤 This account doesn't reference any other program accounts");
        }
        
        if !referenced_by.is_empty() {
            println!("\n📥 This account is referenced by these program accounts:");
            for (pubkey, offset) in referenced_by {
                println!("  ← {} (at offset {})", pubkey, offset);
            }
        } else {
            println!("\n📥 This account is not referenced by any other program accounts");
        }
        
        println!("\n📝 Raw Offset analysis:");
        println!("====================");
        for (i, chunk) in data.chunks(32).enumerate() {
            let key_str = bs58::encode(chunk).into_string();
            println!("Offset {}: {}", i * 32, key_str);
        }
    } else {
        println!("Account not found!");
    }
    
    Ok(())
}

fn analyze_zero_patterns(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n0️⃣  ZERO BYTES ANALYSIS");
    println!("=======================");
    
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts\n", accounts.len());
    
    // Calculate zero byte percentages for all accounts
    let mut percentage_groups: HashMap<usize, Vec<(Pubkey, Vec<u8>)>> = HashMap::new();
    
    for (pubkey, data) in accounts {
        let zero_count = data.iter().filter(|&&byte| byte == 0).count();
        let percentage = ((zero_count as f64 / data.len() as f64) * 100.0).round() as usize;
        percentage_groups.entry(percentage)
            .or_default()
            .push((pubkey, data));
    }
    
    println!("Zero byte percentage distribution:");
    println!("================================");
    let mut percentages: Vec<_> = percentage_groups.keys().cloned().collect();
    percentages.sort();
    
    for percentage in &percentages {
        let count = percentage_groups.get(percentage).unwrap().len();
        println!("{}%: {} accounts", percentage, count);
    }
    
    println!("\nEnter percentage to see details (or press Enter to see all):");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    let input = input.trim();
    
    let selected_percentages = if input.is_empty() {
        percentages
    } else if let Ok(p) = input.parse::<usize>() {
        vec![p]
    } else {
        println!("Invalid input");
        return Ok(());
    };
    
    for percentage in selected_percentages {
        if let Some(accounts) = percentage_groups.get(&percentage) {
            println!("\nAccounts with {}% zero bytes:", percentage);
            println!("=============================");
            
            for (pubkey, data) in accounts {
                let zero_count = data.iter().filter(|&&byte| byte == 0).count();
                println!("\nAccount: {}", pubkey);
                println!("Size: {} bytes", data.len());
                println!("Zero bytes: {} ({}%)", zero_count, percentage);
                
                // Find zero byte patterns
                let mut current_zeros = 0;
                let mut zero_ranges = Vec::new();
                
                for (i, &byte) in data.iter().enumerate() {
                    if byte == 0 {
                        current_zeros += 1;
                    } else if current_zeros > 0 {
                        if current_zeros >= 32 {
                            zero_ranges.push((i - current_zeros, current_zeros));
                        }
                        current_zeros = 0;
                    }
                }
                
                if current_zeros >= 32 {
                    zero_ranges.push((data.len() - current_zeros, current_zeros));
                }
                
                if !zero_ranges.is_empty() {
                    println!("Large zero ranges:");
                    for (start, length) in zero_ranges {
                        println!("  Offset {}: {} zeros", start, length);
                    }
                }
            }
        }
    }
    
    Ok(())
}

fn analyze_cross_references(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🔗 CROSS-REFERENCE ANALYSIS");
    println!("=======================");
    
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts", accounts.len());
    println!("Analyzing {} accounts for cross-references...\n", accounts.len());
    
    // Convert accounts to a HashMap for easier lookup
    let accounts_map: HashMap<String, &Vec<u8>> = accounts.iter()
        .map(|(pubkey, data)| (pubkey.to_string(), data))
        .collect();
    
    // Build reference map
    let mut reference_counts: HashMap<String, usize> = HashMap::new();
    let mut reference_details: HashMap<String, Vec<(String, usize)>> = HashMap::new();
    
    for (pubkey, data) in &accounts {
        // Look for potential pubkey references in the data
        for i in 0..data.len().saturating_sub(31) {
            let slice = &data[i..i+32];
            let ref_str = bs58::encode(slice).into_string();
            if accounts_map.contains_key(&ref_str) {
                *reference_counts.entry(ref_str.clone()).or_insert(0) += 1;
                reference_details.entry(ref_str)
                    .or_default()
                    .push((pubkey.to_string(), i));
            }
        }
    }
    
    println!("📊 Reference Count Summary:");
    println!("Found {} accounts with references\n", reference_counts.len());
    
    println!("How many accounts to display? (press Enter for all):");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    
    let mut refs: Vec<_> = reference_counts.iter().collect();
    refs.sort_by(|a, b| b.1.cmp(a.1));
    
    for (pubkey, count) in refs {
        println!("  {} is referenced {} times", pubkey, count);
    }
    
    println!("\nEnter an account address to see its references (or press Enter to skip):");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    let input = input.trim();
    
    if !input.is_empty() {
        if let Some(refs) = reference_details.get(input) {
            println!("\nReferences to {}:", input);
            for (from, offset) in refs {
                println!("  Referenced by {} at offset {}", from, offset);
            }
        } else {
            println!("No references found for that account");
        }
    }
    
    Ok(())
}

fn analyze_account_ages(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n⏰ ACCOUNT AGE ANALYSIS");
    println!("=====================");
    let accounts = fetcher.get_all_accounts()?;
    println!("Found {} accounts\n", accounts.len());
    
    println!("Fetching historical data for each account (this may take a while)...\n");
    
    let (client, _) = fetcher.get_client();
    let mut age_map = HashMap::new();
    let mut account_details: HashMap<String, Vec<(Pubkey, DateTime<Utc>)>> = HashMap::new();
    
    for (pubkey, _) in accounts {
        let config = GetConfirmedSignaturesForAddress2Config {
            before: None,
            until: None,
            limit: Some(1),
            commitment: None,
        };
        
        match client.get_signatures_for_address_with_config(&pubkey, config) {
            Ok(signatures) => {
                if let Some(oldest_sig) = signatures.last() {
                    if let Some(time) = oldest_sig.block_time {
                        let datetime = DateTime::<Utc>::from_timestamp(time as i64, 0)
                            .unwrap_or_default();
                        let month_year = datetime.format("%Y-%m").to_string();
                        
                        *age_map.entry(month_year.clone()).or_insert(0) += 1;
                        account_details.entry(month_year).or_default().push((pubkey, datetime));
                    }
                }
            }
            Err(e) => {
                println!("Error fetching history for {}: {}", pubkey, e);
                continue;
            }
        }
        
        thread::sleep(Duration::from_millis(100));
    }
    
    println!("Account Creation Timeline:");
    println!("========================");
    
    let mut dates: Vec<_> = age_map.keys().collect();
    dates.sort();
    
    for date in dates {
        let count = age_map.get(date).unwrap();
        println!("{}: {} accounts", date, count);
    }
    
    println!("\nEnter month (YYYY-MM) to see details, or press Enter to skip:");
    let mut filter = String::new();
    io::stdin().read_line(&mut filter)?;
    let filter = filter.trim();
    
    if !filter.is_empty() {
        if let Some(accounts) = account_details.get(filter) {
            println!("\nDetailed view for {}:", filter);
            println!("=====================");
            for (pubkey, datetime) in accounts {
                println!("Account: {}", pubkey);
                println!("  Created: {}\n", datetime.format("%Y-%m-%d %H:%M:%S"));
            }
        } else {
            println!("No accounts found for that month-year");
        }
    }
    
    Ok(())
}

fn main() -> Result<()> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        println!("Please provide a program ID");
        return Ok(());
    }
    
    let mut fetcher = AccountFetcher::new(&args[1])?;
    
    print_intro(&args[1]);
    
    loop {
        println!("\n🔍 SPADE Analysis Options:");
        println!("1. 📊 Basic account analysis");
        println!("2. 📈 Large account analysis");
        println!("3. 📏 Specific size analysis");
        println!("4. 🏷️  Account type analysis");
        println!("5. 🔎 Pattern search");
        println!("6. 🎯 Specific account analysis");
        println!("7. 0️⃣  Zero bytes analysis");
        println!("8. 🔗 Cross-reference analysis");
        println!("9. ⏰ Account age analysis");
        println!("0. Exit");
        println!("\nEnter choice (0-9):");
        
        let mut choice = String::new();
        io::stdin().read_line(&mut choice)?;
        let choice = choice.trim();
        
        if choice == "0" {
            println!("\nThank you for using SPADE!");
            println!("Built by Bluewolf & IcarusxB");
            break;
        }
        
        println!("\n📝 Description:");
        println!("=============");
        println!("{}", get_analysis_description(choice));
        
        println!("\nPress Enter to proceed or 'n' to return:");
        let mut proceed = String::new();
        io::stdin().read_line(&mut proceed)?;
        
        if proceed.trim().to_lowercase() != "n" {
            match choice {
                "1" => analyze_account_basic(&mut fetcher)?,
                "2" => {
                    println!("Show detailed offsets? (y/n):");
                    let mut show_offsets = String::new();
                    io::stdin().read_line(&mut show_offsets)?;
                    analyze_large_accounts(&mut fetcher, show_offsets.trim().to_lowercase() == "y")?
                },
                "3" => analyze_specific_size(&mut fetcher)?,
                "4" => analyze_account_types(&mut fetcher)?,
                "5" => search_pattern(&mut fetcher)?,
                "6" => search_specific_account(&mut fetcher)?,
                "7" => analyze_zero_patterns(&mut fetcher)?,
                "8" => analyze_cross_references(&mut fetcher)?,
                "9" => analyze_account_ages(&mut fetcher)?,
                _ => println!("Invalid choice")
            }
        }
        
        println!("\n##########################Press Enter to continue...##########################");
        let mut wait = String::new();
        io::stdin().read_line(&mut wait)?;
    }
    
    Ok(())
}

