import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/aset-tetap',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::index
* @see app/Http/Controllers/AsetTetapController.php:20
* @route '/aset-tetap'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/aset-tetap/tambah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::create
* @see app/Http/Controllers/AsetTetapController.php:77
* @route '/aset-tetap/tambah'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\AsetTetapController::store
* @see app/Http/Controllers/AsetTetapController.php:85
* @route '/aset-tetap'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/aset-tetap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AsetTetapController::store
* @see app/Http/Controllers/AsetTetapController.php:85
* @route '/aset-tetap'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::store
* @see app/Http/Controllers/AsetTetapController.php:85
* @route '/aset-tetap'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::store
* @see app/Http/Controllers/AsetTetapController.php:85
* @route '/aset-tetap'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::store
* @see app/Http/Controllers/AsetTetapController.php:85
* @route '/aset-tetap'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
export const show = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/aset-tetap/{asetTetap}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
show.url = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asetTetap: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asetTetap: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asetTetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asetTetap: typeof args.asetTetap === 'object'
        ? args.asetTetap.id
        : args.asetTetap,
    }

    return show.definition.url
            .replace('{asetTetap}', parsedArgs.asetTetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
show.get = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
show.head = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
const showForm = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
showForm.get = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AsetTetapController::show
* @see app/Http/Controllers/AsetTetapController.php:140
* @route '/aset-tetap/{asetTetap}'
*/
showForm.head = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\AsetTetapController::depreciate
* @see app/Http/Controllers/AsetTetapController.php:152
* @route '/aset-tetap/{asetTetap}/depreciate'
*/
export const depreciate = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: depreciate.url(args, options),
    method: 'put',
})

depreciate.definition = {
    methods: ["put"],
    url: '/aset-tetap/{asetTetap}/depreciate',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AsetTetapController::depreciate
* @see app/Http/Controllers/AsetTetapController.php:152
* @route '/aset-tetap/{asetTetap}/depreciate'
*/
depreciate.url = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asetTetap: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asetTetap: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asetTetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asetTetap: typeof args.asetTetap === 'object'
        ? args.asetTetap.id
        : args.asetTetap,
    }

    return depreciate.definition.url
            .replace('{asetTetap}', parsedArgs.asetTetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::depreciate
* @see app/Http/Controllers/AsetTetapController.php:152
* @route '/aset-tetap/{asetTetap}/depreciate'
*/
depreciate.put = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: depreciate.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AsetTetapController::depreciate
* @see app/Http/Controllers/AsetTetapController.php:152
* @route '/aset-tetap/{asetTetap}/depreciate'
*/
const depreciateForm = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: depreciate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::depreciate
* @see app/Http/Controllers/AsetTetapController.php:152
* @route '/aset-tetap/{asetTetap}/depreciate'
*/
depreciateForm.put = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: depreciate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

depreciate.form = depreciateForm

/**
* @see \App\Http\Controllers\AsetTetapController::sell
* @see app/Http/Controllers/AsetTetapController.php:195
* @route '/aset-tetap/{aset_tetap}/sell'
*/
export const sell = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sell.url(args, options),
    method: 'post',
})

sell.definition = {
    methods: ["post"],
    url: '/aset-tetap/{aset_tetap}/sell',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AsetTetapController::sell
* @see app/Http/Controllers/AsetTetapController.php:195
* @route '/aset-tetap/{aset_tetap}/sell'
*/
sell.url = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aset_tetap: args }
    }

    if (Array.isArray(args)) {
        args = {
            aset_tetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        aset_tetap: args.aset_tetap,
    }

    return sell.definition.url
            .replace('{aset_tetap}', parsedArgs.aset_tetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::sell
* @see app/Http/Controllers/AsetTetapController.php:195
* @route '/aset-tetap/{aset_tetap}/sell'
*/
sell.post = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sell.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::sell
* @see app/Http/Controllers/AsetTetapController.php:195
* @route '/aset-tetap/{aset_tetap}/sell'
*/
const sellForm = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sell.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::sell
* @see app/Http/Controllers/AsetTetapController.php:195
* @route '/aset-tetap/{aset_tetap}/sell'
*/
sellForm.post = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sell.url(args, options),
    method: 'post',
})

sell.form = sellForm

/**
* @see \App\Http\Controllers\AsetTetapController::dispose
* @see app/Http/Controllers/AsetTetapController.php:293
* @route '/aset-tetap/{aset_tetap}/dispose'
*/
export const dispose = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispose.url(args, options),
    method: 'post',
})

dispose.definition = {
    methods: ["post"],
    url: '/aset-tetap/{aset_tetap}/dispose',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AsetTetapController::dispose
* @see app/Http/Controllers/AsetTetapController.php:293
* @route '/aset-tetap/{aset_tetap}/dispose'
*/
dispose.url = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aset_tetap: args }
    }

    if (Array.isArray(args)) {
        args = {
            aset_tetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        aset_tetap: args.aset_tetap,
    }

    return dispose.definition.url
            .replace('{aset_tetap}', parsedArgs.aset_tetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::dispose
* @see app/Http/Controllers/AsetTetapController.php:293
* @route '/aset-tetap/{aset_tetap}/dispose'
*/
dispose.post = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dispose.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::dispose
* @see app/Http/Controllers/AsetTetapController.php:293
* @route '/aset-tetap/{aset_tetap}/dispose'
*/
const disposeForm = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispose.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::dispose
* @see app/Http/Controllers/AsetTetapController.php:293
* @route '/aset-tetap/{aset_tetap}/dispose'
*/
disposeForm.post = (args: { aset_tetap: string | number } | [aset_tetap: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dispose.url(args, options),
    method: 'post',
})

dispose.form = disposeForm

/**
* @see \App\Http\Controllers\AsetTetapController::archive
* @see app/Http/Controllers/AsetTetapController.php:340
* @route '/aset-tetap/{asetTetap}/archive'
*/
export const archive = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archive.url(args, options),
    method: 'patch',
})

archive.definition = {
    methods: ["patch"],
    url: '/aset-tetap/{asetTetap}/archive',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AsetTetapController::archive
* @see app/Http/Controllers/AsetTetapController.php:340
* @route '/aset-tetap/{asetTetap}/archive'
*/
archive.url = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asetTetap: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asetTetap: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asetTetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asetTetap: typeof args.asetTetap === 'object'
        ? args.asetTetap.id
        : args.asetTetap,
    }

    return archive.definition.url
            .replace('{asetTetap}', parsedArgs.asetTetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::archive
* @see app/Http/Controllers/AsetTetapController.php:340
* @route '/aset-tetap/{asetTetap}/archive'
*/
archive.patch = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archive.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AsetTetapController::archive
* @see app/Http/Controllers/AsetTetapController.php:340
* @route '/aset-tetap/{asetTetap}/archive'
*/
const archiveForm = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::archive
* @see app/Http/Controllers/AsetTetapController.php:340
* @route '/aset-tetap/{asetTetap}/archive'
*/
archiveForm.patch = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

archive.form = archiveForm

/**
* @see \App\Http\Controllers\AsetTetapController::destroy
* @see app/Http/Controllers/AsetTetapController.php:357
* @route '/aset-tetap/{asetTetap}'
*/
export const destroy = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/aset-tetap/{asetTetap}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AsetTetapController::destroy
* @see app/Http/Controllers/AsetTetapController.php:357
* @route '/aset-tetap/{asetTetap}'
*/
destroy.url = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asetTetap: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asetTetap: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asetTetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asetTetap: typeof args.asetTetap === 'object'
        ? args.asetTetap.id
        : args.asetTetap,
    }

    return destroy.definition.url
            .replace('{asetTetap}', parsedArgs.asetTetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::destroy
* @see app/Http/Controllers/AsetTetapController.php:357
* @route '/aset-tetap/{asetTetap}'
*/
destroy.delete = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AsetTetapController::destroy
* @see app/Http/Controllers/AsetTetapController.php:357
* @route '/aset-tetap/{asetTetap}'
*/
const destroyForm = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::destroy
* @see app/Http/Controllers/AsetTetapController.php:357
* @route '/aset-tetap/{asetTetap}'
*/
destroyForm.delete = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\AsetTetapController::pay
* @see app/Http/Controllers/AsetTetapController.php:369
* @route '/aset-tetap/{asetTetap}/pay'
*/
export const pay = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/aset-tetap/{asetTetap}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AsetTetapController::pay
* @see app/Http/Controllers/AsetTetapController.php:369
* @route '/aset-tetap/{asetTetap}/pay'
*/
pay.url = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asetTetap: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { asetTetap: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            asetTetap: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        asetTetap: typeof args.asetTetap === 'object'
        ? args.asetTetap.id
        : args.asetTetap,
    }

    return pay.definition.url
            .replace('{asetTetap}', parsedArgs.asetTetap.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsetTetapController::pay
* @see app/Http/Controllers/AsetTetapController.php:369
* @route '/aset-tetap/{asetTetap}/pay'
*/
pay.post = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::pay
* @see app/Http/Controllers/AsetTetapController.php:369
* @route '/aset-tetap/{asetTetap}/pay'
*/
const payForm = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AsetTetapController::pay
* @see app/Http/Controllers/AsetTetapController.php:369
* @route '/aset-tetap/{asetTetap}/pay'
*/
payForm.post = (args: { asetTetap: string | number | { id: string | number } } | [asetTetap: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

pay.form = payForm

const asetTetap = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    depreciate: Object.assign(depreciate, depreciate),
    sell: Object.assign(sell, sell),
    dispose: Object.assign(dispose, dispose),
    archive: Object.assign(archive, archive),
    destroy: Object.assign(destroy, destroy),
    pay: Object.assign(pay, pay),
}

export default asetTetap