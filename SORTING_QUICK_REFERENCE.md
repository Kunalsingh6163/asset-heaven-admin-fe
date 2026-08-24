# User Sorting - Quick Reference Card

## 🎯 Sort Options

| Option | Action | Visual Badge | Use Case |
|--------|--------|--------------|----------|
| **Default Order** | No sorting | None | View all users as received from API |
| **Name (A to Z)** | Sort ascending | ↑ A-Z | Find users alphabetically |
| **Name (Z to A)** | Sort descending | ↓ Z-A | Find users reverse alphabetically |
| **Verified Users Only** | Filter verified | ✓ Verified | Quality check, active users |
| **Not Verified Users Only** | Filter unverified | ✗ Not Verified | Follow-up on incomplete profiles |

## 🎨 UI Layout

```
┌──────────────────────────────────────────────────────────┐
│  Users Management                       [🔄 Refresh]     │
│  Total: 100 | Showing: 75                               │
├──────────────────────────────────────────────────────────┤
│  🔍 [Search: "john"]                      [Search]       │  ← Lime Theme
│  Found 10 users matching "john"                         │
├──────────────────────────────────────────────────────────┤
│  🔀 Sort By: [Name (A to Z) ▼]            [Clear]       │  ← Pink Theme
│  [↑ A-Z] Showing 10 users                               │
├──────────────────────────────────────────────────────────┤
│  [User Table with sorted & filtered results]            │
└──────────────────────────────────────────────────────────┘
```

## 📋 Common Use Cases

### Use Case 1: Find User Alphabetically
```
Action: Select "Name (A to Z)"
Result: Users sorted A→Z
Badge: [↑ A-Z]
```

### Use Case 2: Review Unverified Users
```
Action: Select "Not Verified Users Only"
Result: Only unverified users shown
Badge: [✗ Not Verified]
Count: Shows unverified count
```

### Use Case 3: Search + Sort
```
1. Search: Type "john"
2. Sort: Select "Name (A to Z)"
Result: Johns sorted alphabetically
Shows: Both search and sort badges
```

### Use Case 4: Verified Johns Only
```
1. Search: Type "john"
2. Sort: Select "Verified Users Only"
Result: Only verified Johns
Count: Combined filter count
```

## 🔄 Reset Options

### Clear Individual Filters
- **Clear Search**: Click X in search box
- **Clear Sort**: Click "Clear" button next to dropdown

### Reset Everything
- **Refresh Button**: Clears both search and sort
- Returns to default order with all users

## 💡 Pro Tips

### Tip 1: Quick Alpha Search
```
Use "Name (A to Z)" to quickly scan through users
alphabetically - faster than scrolling randomly
```

### Tip 2: Verification Audit
```
Select "Not Verified Users Only" to see who needs
follow-up emails for email verification
```

### Tip 3: Combine Filters
```
Search for specific domain (e.g., "@gmail")
Then sort by verified status
= Audit specific email provider users
```

### Tip 4: Reverse Sort
```
Use "Name (Z to A)" to find users at end of alphabet
who might be overlooked in default view
```

## 🎨 Color Coding

### Lime Theme = Search (Input)
- **Border**: lime/30
- **Button**: Lime gradient
- **Badge**: Lime-dark text

### Pink Theme = Sort (Organization)  
- **Border**: pink/20
- **Button**: Pink gradient  
- **Badge**: Pink-dark text

### Visual Hierarchy
```
Search (Lime) → Input data
   ↓
Sort (Pink) → Organize data
   ↓
Table (Lime borders) → Display data
```

## ⚡ Performance Notes

- **Fast**: Uses optimized useMemo
- **Instant**: Updates on selection
- **Smooth**: No lag on large lists
- **Smart**: Only recalculates when needed

## 📊 Example Scenarios

### Scenario A: New Admin Onboarding
**Goal**: Show them verified users first
```
1. Select "Verified Users Only"
2. See [✓ Verified] badge
3. Review active user base
```

### Scenario B: Cleanup Campaign
**Goal**: Find unverified users to email
```
1. Select "Not Verified Users Only"
2. See [✗ Not Verified] badge
3. Export list for email campaign
```

### Scenario C: Find Specific User
**Goal**: Find "John Smith" quickly
```
1. Search: "john"
2. Sort: "Name (A to Z)"
3. Scan alphabetically
4. Find user fast
```

### Scenario D: Domain Audit
**Goal**: Check Gmail users verification rate
```
1. Search: "@gmail.com"
2. Sort: "Verified Users Only"
3. Count verified Gmail users
4. Switch to "Not Verified Users Only"
5. Count unverified Gmail users
6. Calculate verification %
```

## 🎯 Status Indicators

### Active Sort Indicators
- **Clear Button**: Visible when sort active
- **Badge**: Shows current sort with icon
- **Counter**: Shows filtered count
- **Dropdown**: Shows selected option

### No Sort Active
- **No Clear Button**
- **No Badge**
- **Total count only**
- **Dropdown**: Shows "Default Order"

## 🔍 Sort + Search Matrix

| Search Active | Sort Active | Display |
|---------------|-------------|---------|
| ❌ No | ❌ No | All users (default) |
| ✅ Yes | ❌ No | Filtered by search |
| ❌ No | ✅ Yes | Filtered/sorted by option |
| ✅ Yes | ✅ Yes | Both filters applied |

## 📱 Responsive Behavior

- **Desktop**: Full layout with all features
- **Tablet**: Stacked search and sort
- **Mobile**: Vertical layout, touch-friendly dropdowns

## 🚀 Keyboard Shortcuts

While focused on dropdown:
- **Arrow Keys**: Navigate options
- **Enter**: Select option
- **Escape**: Close dropdown
- **Tab**: Move to clear button

## ✅ Quality Checks

### Before Using Sort
- [ ] Users loaded from API
- [ ] No errors displayed
- [ ] Table showing data

### After Applying Sort
- [ ] Badge appears
- [ ] Counter updates
- [ ] Clear button visible
- [ ] Table reflects sort

### Combining Features
- [ ] Search works with sort
- [ ] Refresh clears both
- [ ] Counts are accurate
- [ ] UI responsive

---

**Quick Start**: Select dropdown → Choose option → View sorted results  
**Quick Reset**: Click Clear button or Refresh  
**Quick Combo**: Search first, then sort
