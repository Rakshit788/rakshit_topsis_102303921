# rakshit_102303921

**Multi-Criteria Decision Analysis using TOPSIS** - A Python implementation for ranking alternatives based on proximity to the ideal solution.

## Overview

This package implements the TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) methodology for evaluating and ranking multiple alternatives against several criteria. It provides an intuitive command-line interface for analyzing CSV-formatted datasets.

## Setup

Use pip to install the package:

```bash
pip install rakshit_102303921
```

## Getting Started

Once installed, execute the `topsis` command directly from your command line:

```bash
topsis <InputDataFile> <Weights> <Impacts> <OutputResultFileName>
```

### Command Arguments

- **InputDataFile**: Location of your input CSV file
- **Weights**: Criterion weights separated by commas (example: "1,1,1,2")
- **Impacts**: Criterion optimization directions separated by commas ('+' to maximize, '-' to minimize)
- **OutputResultFileName**: Destination path for the output CSV file

### Sample Command

```bash
topsis data.csv "1,1,1,2" "+,+,-,+" result.csv
```

This execution:
- Processes data from `data.csv`
- Assigns weights: 1, 1, 1, 2 across four criteria
- Optimizes criteria 1, 2, 4 upward and criterion 3 downward
- Writes output to `result.csv`

## Data Structure Requirements

Your input CSV file should be organized as follows:

- **Column 1**: Alternative/option identifiers
- **Subsequent columns**: Numerical criterion values
- **Column requirement**: At least 3 columns (1 identifier + 2 or more criteria)

### Sample Input File (`data.csv`)

```csv
Model,Price,Storage,Camera,Battery
P1,250,64,12,4000
P2,200,32,8,3500
P3,300,128,16,4500
P4,275,64,12,4200
P5,225,32,16,3800
```

## Result Structure

The generated output CSV contains all input columns along with:

- **Topsis Score**: Performance score ranging from 0 to 1 (1 being optimal)
- **Rank**: Position based on TOPSIS score (Rank 1 represents the best alternative)

### Sample Output File (`result.csv`)

```csv
Model,Price,Storage,Camera,Battery,Topsis Score,Rank
P3,300,128,16,4500,0.691,1
P4,275,64,12,4200,0.535,2
P1,250,64,12,4000,0.534,3
P5,225,32,16,3800,0.401,4
P2,200,32,8,3500,0.308,5
```

## Understanding Weights and Impacts

### Criterion Weights
Weights define the relative significance of each criterion:
- Must be numerical values
- Separated by commas
- Count must equal the number of criteria
- Example: `"1,2,1,3"` indicates criterion 2 holds double the importance of criterion 1

### Optimization Directions
Impacts specify the desired optimization direction for each criterion:
- **'+'**: Maximize (beneficial when higher - e.g., performance, capacity, durability)
- **'-'**: Minimize (beneficial when lower - e.g., cost, size, energy consumption)
- Separated by commas
- Count must equal the number of criteria
- Example: `"+,+,-,+"` 

## TOPSIS Methodology Explained

1. **Normalization**: Apply vector normalization to the decision matrix
2. **Weighting**: Multiply normalized values by corresponding weights
3. **Ideal Solutions**: Determine ideal best and ideal worst values per criterion
4. **Distance Calculation**: Compute Euclidean distances from each alternative to both ideal solutions
5. **Score Computation**: Calculate TOPSIS score using: `Score = Distance_to_worst / (Distance_to_best + Distance_to_worst)`
6. **Ranking**: Order alternatives by TOPSIS scores in descending order

## Validation Checks

The package performs comprehensive validation for:
- ✓ Proper argument count in command-line execution
- ✓ Input file accessibility
- ✓ Minimum column requirement (3 columns)
- ✓ Numerical data in all criterion columns
- ✓ Weight count alignment with criterion count
- ✓ Impact count alignment with criterion count
- ✓ Valid impact symbols (only '+' or '-')

## Dependencies

- Python 3.6 or higher
- pandas >= 1.0.0
- numpy >= 1.18.0

## Licensing

Distributed under the MIT License - refer to the LICENSE file for complete details

## Package Maintainer

Rakshit Chopra

## Current Version

1.0.2

## Project Resources

PyPI Package: https://pypi.org/project/rakshit-102303921/

Source Code: https://github.com/rakshit788/TOPSIS
website : https://rakshit788.github.io/rakshit_topsis_102303921/
