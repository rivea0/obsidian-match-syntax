# MatchSyntax for Obsidian

A flexible, "regex-like" lookups for your notes, using the [`compromise` match syntax](https://observablehq.com/@spencermountain/compromise-match-syntax).

MatchSyntax will highlight the parts of the text in your active note that match your "match-syntax" query.

## Examples

Part-of-speech tags can be used for searches of grammatical parts in a note. The syntax for looking for all the adjectives followed by plural words can look like this:

https://github.com/user-attachments/assets/ff264c14-853b-473a-8b8d-c3d76994bd9a

You can do regex searches with `//` syntax. Let's say we want to look for any word that starts with `natur` and is followed by either `e` or `al`:

https://github.com/user-attachments/assets/f10bc077-7240-44c4-8aa0-0d332e20dcb6

_It's always advised to be careful with regex. This will also be slower than other types of lookups._

MatchSyntax is flexible, so you can combine different types of matches. Let's say we first searched for all nouns that are followed after the word "spiritual." Then, we might realize we don't want the plural nouns. So instead, we can use an AND syntax (`&&`) and negative matching (`!`) to indicate we want to exclude plural nouns:

https://github.com/user-attachments/assets/89b3b70b-a7f9-47c8-b542-c88d7200d301

> [!NOTE]
> MatchSyntax heavily depends on the [`compromise` library](https://github.com/spencermountain/compromise). The matching works only with English grammar; although `compromise` has some "work-in-progress" for other languages, there is only English support for this plugin at the moment.

## Types of matches
_MatchSyntax supports most types of `compromise` matches that are listed below, you can also check out [its documentation](https://observablehq.com/@spencermountain/compromise-match-syntax)._

### Word-matches
Direct lookups.

### Tag-matches (`#`)
Lookups using part-of-speech tagging.

#### Supported tags:

```
#Noun
    #Singular
        #Person
            #FirstName
                #MaleName
                #FemaleName
            #LastName
    #Place
        #Country
        #City
        #Region
        #Address
    #Organization
        #SportsTeam
        #Company
        #School
    #ProperNoun
    #Honorific
    #Plural
    #Uncountable
    #Pronoun
    #Actor
    #Activity
    #Unit
    #Demonym
    #Possessive
#Verb
    #PresentTense
        #Infinitive
        #Gerund
    #PastTense
    #PerfectTense
    #FuturePerfect
    #Pluperfect
    #Copula
    #Modal
    #Participle
    #Particle
    #PhrasalVerb
#Value
    #Ordinal
    #Cardinal
        #RomanNumeral
    #Multiple
    #Fraction
    #TextValue
    #NumericValue
    #Percent
    #Money
#Date
    #Month
    #WeekDay
    #RelativeDay
    #Year
    #Duration
    #Time
    #Holiday
#Adjective
    #Comparable
    #Comparative
    #Superlative
#Contraction
#Adverb
#Currency
#Determiner
#Conjunction
#Preposition
#QuestionWord
#Pronoun
#Expression
#Abbreviation
#Url
#HashTag
#PhoneNumber
#AtMention
#Emoji
#Emoticon
#Email
#Auxiliary
#Negative
#Acronym
```

_See more in the [`compromise` documentation](https://observablehq.com/@spencermountain/compromise-tags)._

### Wildcard-matches (`.`/`*`)
_The `.` character means any one term._

_The `*` character means zero or more terms._

### Greedy-match (`+`)
_The`+` character at the end of a tag (or `.`) implies the match will continue with repeated consecutive matches, as far as it can._

### Optional matching (`?`)
_The `?` character at the end of a word means it is nice to have, but not necessary._

### Options list (OR logic)
_`(word1|word2)` parentheses allow listing possible matches for the word (OR logic)._

### RegEx-match (`/<reg>/`)
_JavaScript regular-expressions using the `/myregex/` syntax._

**Note: RegEx matches should be carefully used as they can be slower than other types of lookups.**

### First/Last (`^`/`$`)
_Something should be in the start, or end of a match._

### Negative (`!`)
_Something not-match with a leading `!` character._

### Range (`{min,max}`)
_A maximum, minimum number of wildcard terms._

### Prefix, suffix, infix
_Sub-word matches, with the regex `/ /` characters._

### AND logic (`&&`)
_AND logic using two match statements._

### @ methods
- `@hasQuote`
- `@hasComma`
- `@hasPeriod`
- `@hasExclamation`
- `@hasQuestionMark`
- `@hasEllipses`
- `@hasSemicolon`
- `@hasColon`
- `@hasSlash`
- `@hasHyphen`
- `@hasDash`
- `@hasContraction`
- `@isAcronym`
- `@isKnown`
- `@isUpperCase`
- `@isTitleCase`

### Fuzzy-matches (`~`)
_Text-matching using `~` characters. Damerau–Levenshtein distance is used to compute approximate string matches._

_See more in the [`compromise` documentation](https://observablehq.com/@spencermountain/compromise-fuzzy-matching)._

## Installation

In Obsidian, you can go to **Settings** → **Community plugins** → **Browse**.
Then, search for "MatchSyntax" and click Install.

Or, alternatively, you can clone this repository, and move it to your vault's `.obsidian/plugins` directory. From there, run:

```
npm run build
```

Then, go to **Settings** → **Community plugins**, and activate MatchSyntax under Installed Plugins.

## Usage

MatchSyntax provides two commands: "Enter match syntax" and "Clear match highlights."
You can choose "Enter match syntax" to write your syntax and click "Find matches" to see the matched parts of the active note.

You can bind hotkeys for the commands by going to **Community plugins**, find MatchSyntax in Installed Plugins, and choosing "Hotkeys" button.

Highlights are cleared automatically when there is a change in editor. You can override this behavior by setting "Manually clear the highlights" on inside plugin settings.

### TODO and Ideas
- Custom tags
- Add setting to display the number of matches in the status bar
- Add a widget to the editor for input and clearing highlights

## License
GPLv3
