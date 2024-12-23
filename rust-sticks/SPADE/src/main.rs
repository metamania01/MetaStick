use solana_client::rpc_config::{RpcProgramAccountsConfig, RpcAccountInfoConfig};
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use anyhow::Result;
use std::str::FromStr;
use std::collections::{HashMap, HashSet};
use std::env;
use std::io;
use dotenv::dotenv;
use solana_account_decoder::UiAccountEncoding;
use solana_client::rpc_client::GetConfirmedSignaturesForAddress2Config;
use chrono::DateTime;
use chrono::Utc;

/// Provides descriptions for each analysis type in SPADE
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

/// Displays the SPADE introduction banner with program information
fn print_intro(program_id: &str) {
    println!("
╔════════════════════════════════════════════════╗
║                    S P A D E                   ║
║        Solana Program Account Data Explorer    ║
║                                                ║
║ Program: {}  ║
║                                                ║
║                                                ║
║  Version: 1.0.0                                ║
╚════════════════════════════════════════════════╝
", program_id);
}

/// Main account fetcher struct to handle RPC connections and program data
struct AccountFetcher {
    // List of RPC clients for redundancy and load balancing
    clients: Vec<RpcClient>,
    program_id: Pubkey,
    current_client: usize,
}

impl AccountFetcher {
    /// Creates a new AccountFetcher instance with multiple RPC endpoints
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

    /// Returns the next available RPC client in a round-robin fashion
    fn get_client(&mut self) -> (&RpcClient, Pubkey) {
        let client = &self.clients[self.current_client];
        self.current_client = (self.current_client + 1) % self.clients.len();
        (client, self.program_id)
    }

    /// Fetches all accounts for the program, retrying with different RPC endpoints on failure
    fn get_all_accounts(&mut self) -> Result<Vec<(Pubkey, Vec<u8>)>> {
        let mut last_error = None;
        
        // Try each client until one works
        for _ in 0..self.clients.len() {
            let (client, program_id) = self.get_client();
            match client.get_program_accounts(&program_id) {
                Ok(accounts) => {
                    println!("Found {} accounts", accounts.len());
                    return Ok(accounts.into_iter()
                        .map(|(pubkey, account)| (pubkey, account.data))
                        .collect());
                }
                Err(e) => {
                    println!("RPC error, trying next endpoint: {:?}", e);
                    last_error = Some(e);
                    self.current_client = (self.current_client + 1) % self.clients.len();
                }
            }
        }
        
        Err(anyhow::anyhow!("All RPC endpoints failed. Last error: {:?}", last_error))
    }
}

/// Performs basic analysis of all program accounts
fn analyze_account_basic(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n📊 BASIC ACCOUNT ANALYSIS");
    println!("=======================");
    
    let all_accounts = fetcher.get_all_accounts()?;
    println!("Total accounts found: {}", all_accounts.len());
    
    let mut size_groups: HashMap<usize, Vec<(Pubkey, Vec<u8>)>> = HashMap::new();
    for (pubkey, data) in &all_accounts {
        size_groups.entry(data.len())
            .or_default()
            .push((*pubkey, data.clone()));
    }
    
    println!("\nSize distribution:");
    for (size, accounts) in &size_groups {
        println!("- Size {} bytes: {} accounts", size, accounts.len());
    }
    
    Ok(())
}

/// Analyzes accounts larger than a specified size
fn analyze_large_accounts(fetcher: &mut AccountFetcher, show_offsets: bool) -> Result<()> {
    println!("\nEnter minimum size in bytes (default: 2000):");
    let mut size_input = String::new();
    io::stdin().read_line(&mut size_input)?;
    
    let min_size = size_input.trim().parse::<usize>().unwrap_or(2000);
    
    println!("\n🔍 LARGE ACCOUNT ANALYSIS (>{} bytes)", min_size);
    println!("====================================");
    
    let all_accounts = fetcher.get_all_accounts()?;
    
    for (pubkey, data) in &all_accounts {
        if data.len() > min_size {
            println!("\nAccount: {}", pubkey);
            println!("Size: {} bytes", data.len());
            println!("First 32 bytes: {:?}", &data[..32]);
            
            if show_offsets {
                println!("\nOffset analysis:");
                for (i, chunk) in data.chunks(32).enumerate() {
                    let key_str = bs58::encode(chunk).into_string();
                    println!("Offset {}: {}", i * 32, key_str);
                }
            }
        }
    }
    
    Ok(())
}

/// Analyzes accounts of a specific size
fn analyze_specific_size(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\nEnter exact size in bytes to analyze (e.g., 377):");
    let mut size_input = String::new();
    io::stdin().read_line(&mut size_input)?;
    
    let target_size = size_input.trim().parse::<usize>().unwrap_or(377);
    
    println!("\n🎯 SPECIFIC SIZE ANALYSIS ({} bytes)", target_size);
    println!("====================================");
    
    let all_accounts = fetcher.get_all_accounts()?;
    let specific_accounts: Vec<_> = all_accounts.iter()
        .filter(|(_, data)| data.len() == target_size)
        .collect();
    
    println!("Found {} accounts of size {} bytes", specific_accounts.len(), target_size);
    
    for (pubkey, data) in specific_accounts {
        println!("\n📝 Account: {}", pubkey);
        println!("Size: {} bytes", data.len());
        println!("First 32 bytes: {:?}", &data[..32]);
        
        println!("\nOffset analysis:");
        for (i, chunk) in data.chunks(32).enumerate() {
            let key_str = bs58::encode(chunk).into_string();
            println!("Offset {}: {}", i * 32, key_str);
        }
    }
    
    Ok(())
}

/// Groups and analyzes accounts by their discriminator
fn analyze_account_types(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🏷️  ACCOUNT TYPE ANALYSIS");
    println!("=======================");
    
    let all_accounts = fetcher.get_all_accounts()?;
    let mut type_groups: HashMap<Vec<u8>, Vec<(Pubkey, Vec<u8>)>> = HashMap::new();
    
    // Group accounts by their discriminator
    for (pubkey, data) in all_accounts {
        if data.len() >= 8 {
            let discriminator = data[..8].to_vec();
            type_groups.entry(discriminator)
                .or_default()
                .push((pubkey, data));
        }
    }
    
    println!("\nFound {} different account types", type_groups.len());
    
    // Analyze each type
    for (discriminator, accounts) in &type_groups {
        println!("\n📌 Account Type: {:02x?}", discriminator);
        println!("Count: {} accounts", accounts.len());
        
        // Get unique sizes
        let sizes: HashSet<_> = accounts.iter().map(|(_, data)| data.len()).collect();
        println!("Sizes: {:?}", sizes);
        
        // Show example accounts
        println!("\nExample accounts:");
        for (pubkey, data) in accounts.iter().take(3) {
            println!("- {} ({} bytes)", pubkey, data.len());
            if data.len() >= 32 {
                println!("  First 32 bytes: {:02x?}", &data[..32]);
            }
        }
        println!("---");
    }
    
    Ok(())
}

/// Searches for specific byte patterns across all accounts
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

/// Provides detailed analysis of a specific account including:
/// - Creation time
/// - Cross references
/// - Data structure
fn search_specific_account(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🔍 SPECIFIC ACCOUNT ANALYSIS");
    println!("Enter account address:");
    let mut addr_input = String::new();
    io::stdin().read_line(&mut addr_input)?;
    
    let search_pubkey = Pubkey::from_str(addr_input.trim())?;
    
    // Get all data we need from the client first
    let accounts = fetcher.get_all_accounts()?;
    let (client, _) = fetcher.get_client();
    
    if let Some((_, data)) = accounts.iter().find(|(pubkey, _)| *pubkey == search_pubkey) {
        println!("\nAccount found!");
        println!("Size: {} bytes", data.len());
        println!("First 32 bytes: {:?}", &data[..32]);
        
        // Get creation time
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
        
        // Cross-reference analysis
        println!("\n🔄 Cross References Analysis:");
        println!("==========================");
        
        let mut references_to = Vec::new();
        let mut referenced_by = Vec::new();
        
        // Look for references in the target account's data
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
                println!("   {} (at offset {})", pubkey, offset);
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

/// Analyzes distribution of zero bytes in accounts
fn analyze_zero_patterns(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n0️⃣  ZERO BYTES ANALYSIS");
    println!("=======================");
    
    let accounts = fetcher.get_all_accounts()?;
    let mut results = Vec::new();
    let mut percentage_groups: HashMap<u32, Vec<(Pubkey, usize, usize)>> = HashMap::new();
    
    // Analyze all accounts
    for (pubkey, data) in accounts {
        let zero_count = data.iter().filter(|&&b| b == 0).count();
        let zero_ratio = zero_count as f64 / data.len() as f64;
        let percentage = (zero_ratio * 100.0) as u32;
        
        percentage_groups.entry(percentage)
            .or_default()
            .push((pubkey, data.len(), zero_count));
        
        results.push((pubkey, data.len(), zero_count, percentage));
    }
    
    // Show summary of percentages
    println!("\nZero byte percentage distribution:");
    println!("================================");
    let mut percentages: Vec<_> = percentage_groups.keys().collect();
    percentages.sort_unstable();
    
    for &percentage in &percentages {
        let count = percentage_groups[&percentage].len();
        println!("{}%: {} accounts", percentage, count);
    }
    
    // Ask for specific percentage
    println!("\nEnter percentage to see details (or press Enter to see all):");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    
    let filtered_results = if let Ok(target_percentage) = input.trim().parse::<u32>() {
        results.into_iter()
            .filter(|(_, _, _, p)| *p == target_percentage)
            .collect::<Vec<_>>()
    } else {
        results
    };
    
    println!("\nDetailed analysis:");
    println!("=================");
    for (pubkey, size, zero_count, percentage) in filtered_results {
        println!(
            "Account: {}\n  Size: {} bytes\n  Zero bytes: {} ({}%)\n",
            pubkey,
            size,
            zero_count,
            percentage
        );
    }
    
    Ok(())
}

/// Maps relationships between accounts in the program
fn analyze_cross_references(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n🔗 CROSS-REFERENCE ANALYSIS");
    println!("=======================");
    
    let accounts = fetcher.get_all_accounts()?;
    let mut references = HashMap::new();
    
    // Store all account pubkeys for quick lookup
    let account_pubkeys: HashSet<_> = accounts.iter()
        .map(|(pubkey, _)| pubkey)
        .collect();
    
    println!("Analyzing {} accounts for cross-references...", accounts.len());
    
    // For each account's data
    for (pubkey, data) in &accounts {
        // Look through the data in 32-byte windows (size of a Pubkey)
        for (offset, window) in data.windows(32).enumerate() {
            // Try to convert the 32 bytes into a Pubkey
            if let Ok(found_pubkey) = Pubkey::try_from(window) {
                // Check if this pubkey belongs to one of our program's accounts
                if account_pubkeys.contains(&found_pubkey) && found_pubkey != *pubkey {
                    // Store the reference with its offset
                    references.entry(*pubkey)
                        .or_insert_with(Vec::new)
                        .push((found_pubkey, offset));
                }
            }
        }
    }
    
    // Show results
    if references.is_empty() {
        println!("\nNo cross-references found between accounts!");
        return Ok(());
    }
    
    // Count references to each account
    let mut reference_counts: HashMap<Pubkey, usize> = HashMap::new();
    for (_, refs) in &references {
        for (ref_pubkey, _) in refs {
            *reference_counts.entry(*ref_pubkey).or_default() += 1;
        }
    }
    
    // Show summary
    println!("\n📊 Reference Count Summary:");
    let mut counts: Vec<_> = reference_counts.iter().collect();
    counts.sort_by_key(|&(_, count)| std::cmp::Reverse(*count));
    
    println!("Found {} accounts with references", counts.len());
    println!("\nHow many accounts to display? (press Enter for all):");
    let mut limit_input = String::new();
    io::stdin().read_line(&mut limit_input)?;
    
    let limit = if let Ok(num) = limit_input.trim().parse::<usize>() {
        num
    } else {
        counts.len()
    };

    for (pubkey, count) in counts.iter().take(limit) {
        println!("  {} is referenced {} times", pubkey, count);
    }
    
    // Ask for detailed analysis
    println!("\nEnter an account address to see its references (or press Enter to skip):");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    
    if let Ok(search_pubkey) = Pubkey::from_str(input.trim()) {
        if let Some(refs) = references.get(&search_pubkey) {
            println!("\n📍 Account {} references:", search_pubkey);
            for (ref_pubkey, offset) in refs {
                println!("  - {} (at offset {})", ref_pubkey, offset);
            }
        } else {
            // Check if it's a referenced account
            let referencing_accounts: Vec<_> = references.iter()
                .filter(|(_, refs)| refs.iter().any(|(p, _)| p == &search_pubkey))
                .collect();
            
            if !referencing_accounts.is_empty() {
                println!("\n📍 Account {} is referenced by:", search_pubkey);
                for (account, _) in referencing_accounts {
                    println!("  - {}", account);
                }
            } else {
                println!("No references found for this account!");
            }
        }
    }
    
    Ok(())
}

/// Analyzes account creation timeline and groups by age
fn analyze_account_ages(fetcher: &mut AccountFetcher) -> Result<()> {
    println!("\n⏰ ACCOUNT AGE ANALYSIS");
    println!("=====================");
    
    let (client, program_id) = fetcher.get_client();
    
    let accounts = client.get_program_accounts_with_config(
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
        }
    )?;
    
    println!("Found {} accounts", accounts.len());
    println!("\nFetching historical data for each account (this may take a while)...");
    
    let mut account_histories: Vec<(Pubkey, u64, String)> = Vec::new();
    
    // For each account, get its earliest transaction
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
                    let block_time = oldest_sig.block_time.unwrap_or(0);
                    let datetime = DateTime::<Utc>::from_timestamp(block_time as i64, 0)
                        .unwrap_or_default()
                        .format("%Y-%m-%d %H:%M:%S")
                        .to_string();
                    
                    account_histories.push((pubkey, block_time as u64, datetime));
                }
            }
            Err(e) => {
                println!("Failed to get history for {}: {}", pubkey, e);
            }
        }
        
        // Add a small delay to avoid rate limiting
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
    
    // Sort by creation time
    account_histories.sort_by_key(|(_pubkey, time, _datetime)| *time);
    
    // Group by month/year
    let mut time_groups: HashMap<String, Vec<(Pubkey, u64, String)>> = HashMap::new();
    
    for (pubkey, time, datetime) in account_histories {
        let month_year = DateTime::<Utc>::from_timestamp(time as i64, 0)
            .unwrap_or_default()
            .format("%Y-%m")
            .to_string();
            
        time_groups.entry(month_year)
            .or_default()
            .push((pubkey, time, datetime));
    }
    
    // Show summary
    println!("\nAccount Creation Timeline:");
    println!("========================");
    
    let mut months: Vec<_> = time_groups.keys().collect();
    months.sort();
    
    for month in months {
        let accounts = &time_groups[month];
        println!("{}: {} accounts", month, accounts.len());
    }
    
    // Ask for detailed view
    println!("\nEnter month (YYYY-MM) to see details, or press Enter to skip:");
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    
    let month = input.trim();
    if !month.is_empty() {
        if let Some(accounts) = time_groups.get(month) {
            println!("\nDetailed view for {}:", month);
            println!("=====================");
            
            for (pubkey, _time, datetime) in accounts {
                println!("Account: {}\n  Created: {}\n", pubkey, datetime);
            }
        } else {
            println!("No accounts found.");
        }
    }
    
    Ok(())
}

fn main() -> Result<()> {
    // Load environment variables
    dotenv().ok();
    
    // Validate command line arguments
    let args: Vec<String> = env::args().collect();
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



