import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import transferB596af from './transfer'
/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/jurnal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::index
* @see app/Http/Controllers/JournalController.php:20
* @route '/jurnal'
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
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/jurnal/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::create
* @see app/Http/Controllers/JournalController.php:198
* @route '/jurnal/create'
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
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:212
* @route '/jurnal/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/jurnal/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:212
* @route '/jurnal/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:212
* @route '/jurnal/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:212
* @route '/jurnal/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::store
* @see app/Http/Controllers/JournalController.php:212
* @route '/jurnal/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
export const edit = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/jurnal/{journal}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
edit.url = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: typeof args.journal === 'object'
        ? args.journal.id
        : args.journal,
    }

    return edit.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
edit.get = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
edit.head = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
const editForm = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
editForm.get = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::edit
* @see app/Http/Controllers/JournalController.php:284
* @route '/jurnal/{journal}/edit'
*/
editForm.head = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:312
* @route '/jurnal/{journal}'
*/
export const update = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/jurnal/{journal}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:312
* @route '/jurnal/{journal}'
*/
update.url = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: typeof args.journal === 'object'
        ? args.journal.id
        : args.journal,
    }

    return update.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:312
* @route '/jurnal/{journal}'
*/
update.put = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:312
* @route '/jurnal/{journal}'
*/
const updateForm = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::update
* @see app/Http/Controllers/JournalController.php:312
* @route '/jurnal/{journal}'
*/
updateForm.put = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:394
* @route '/jurnal/{journal}'
*/
export const destroy = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/jurnal/{journal}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:394
* @route '/jurnal/{journal}'
*/
destroy.url = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { journal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { journal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            journal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        journal: typeof args.journal === 'object'
        ? args.journal.id
        : args.journal,
    }

    return destroy.definition.url
            .replace('{journal}', parsedArgs.journal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:394
* @route '/jurnal/{journal}'
*/
destroy.delete = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:394
* @route '/jurnal/{journal}'
*/
const destroyForm = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JournalController::destroy
* @see app/Http/Controllers/JournalController.php:394
* @route '/jurnal/{journal}'
*/
destroyForm.delete = (args: { journal: string | number | { id: string | number } } | [journal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
export const transfer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transfer.url(options),
    method: 'get',
})

transfer.definition = {
    methods: ["get","head"],
    url: '/jurnal-transfer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
transfer.url = (options?: RouteQueryOptions) => {
    return transfer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
transfer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transfer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
transfer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transfer.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
const transferForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transfer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
transferForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transfer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JournalController::transfer
* @see app/Http/Controllers/JournalController.php:1001
* @route '/jurnal-transfer'
*/
transferForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transfer.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

transfer.form = transferForm

const jurnal = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    transfer: Object.assign(transfer, transferB596af),
}

export default jurnal