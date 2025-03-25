# Neopets League Damage Calculator

The purpose is to have an accessible tool for everyone so that you can easily make the math for your turns, taking into account weapons and abilities, thus making it a breeze to think of combos in the meanwhile.

## Roadmap

1. Getting the weapon1 + weapon2 to work
2. Add abilities
3. Filter by league (DDL, L54, L97, etc)
4. Duplicate for having a "simulation" of a turn
5. Searching for weapons
6. Maybe animations? Ideas welcome!

## Contributing

If you are a developer, talk to JCab or me (Jenny) on how we could collaborate and we could set it up to get access to the github repo for collaboration.

If you are not a developer, expanding the list of weapons is always welcome! The format for adding a weapon is the following (check [the full template too](./data/template.json)):

```json
{
        "id": "fire-sword",
        "name": "Fire Sword",
        "type": "weapon",
        "tags": ["l54, dDl, L97"],
        "description": "Flavor text",
        "minimumOffensiveFireIcons": 3,
        "maximumOffensiveFireIcons": 5,
        "minimumOffensivePhysicalIcons": 2,
        "maximumOffensivePhysicalIcons": 4,
        "minimumDefensiveFireIcons": 3,
        "maximumDefensiveFireIcons": 5,
        "minimumReflectFirePercentage": 25.0,
        "maximumReflectFirePercentage": 75.0,
        "minimumPercentageBlockFire": 75.0,
        "maximumPercentageBlockFire": 100.0,
        "specialEffects": ["Has a 10% chance to ignite the target"]
      },
```

Where:
* ID refers to the item id in Battlepedia, this is **required** for creating a link there
* Name is the name on Neopets, also **required**
* Type is **optional** for now, will be used for filtering weapons by types
* Tags is **required** since it allows us to filter for league, you need to add all of them as a string (`"this is a string"`, double quotes and the content inside), all of them separated by commas and inside square brackets (a single tag looks like this: `["tag"]`). Casing does not matter.
* Description is **optional** but could be good to add our own or use neopets' description
* minimumOffensive<Type>Icons is **required** for all icons that apply. For example, Grimoire of Thade would have `minimumOffensiveDarkIcons: 5`, `maximumOffensiveDarkIcons: 5`, `minimumOffensivePhysicalIcons: 0.3`, and `maximumOffensivePhysicalIcons: 3`, but no other ones are needed
* minimumDefensive<Type>Icons is **required** for all icons that apply. For example, Grimoire of Thade would have `minimumDefensiveDarkIcons: 5` and `maximumDefensiveDarkIcons: 5` but no other ones are needed
* minimumReflect<Type>Percentage is **required** when the item is a reflector, so for example if it reflects 80-100% of fire, you'd replace <Type> with Fire and use 80 as the value here.
* maximumReflect<Type>Percentage is **required** when the item is a reflector, so for example if it reflects 80-100% of fire, you'd replace <Type> with Fire and use 100 as the value here.
* minimumPercentageBlock<Type> is **required** when the item blocks a percentage of an icon, for example, Roxtons Trusty Bowie Knife would have 75 as value here.
* maximumPercentageBlock<Type> is **required** when the item blocks a percentage of an icon, for example, Roxtons Trusty Bowie Knife would have 75 as value here.
* Special Effects is **required** for items that have glitches, heal, or have any other effect besides regular damage. E.G., Whirling Mopper deals **Ice Damage** which is glitched, so you could add it like: `specialEffects: ["Deals glitched, unblockable Ice damage instead of water"]`.

If you think another variable would be good, let me know and we can discuss it to add it. Follow the conventions that are in place, so the "keys" (like `specialEffects`) are Camel Case (first letter is not capitalized, the others for each word are).

To add them, you may past them here or if you know how to use GitHub, you can create a Merge Request!

## Notes

This tool is aimed to everyone in Neopets that does leagues.