import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/mitra',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::index
* @see app/Http/Controllers/Admin/PartnerAdminController.php:17
* @route '/admin/mitra'
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
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/mitra/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::create
* @see app/Http/Controllers/Admin/PartnerAdminController.php:52
* @route '/admin/mitra/create'
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
* @see \App\Http\Controllers\Admin\PartnerAdminController::store
* @see app/Http/Controllers/Admin/PartnerAdminController.php:60
* @route '/admin/mitra'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/mitra',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::store
* @see app/Http/Controllers/Admin/PartnerAdminController.php:60
* @route '/admin/mitra'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::store
* @see app/Http/Controllers/Admin/PartnerAdminController.php:60
* @route '/admin/mitra'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::store
* @see app/Http/Controllers/Admin/PartnerAdminController.php:60
* @route '/admin/mitra'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::store
* @see app/Http/Controllers/Admin/PartnerAdminController.php:60
* @route '/admin/mitra'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
export const edit = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/mitra/{partner}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
edit.url = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partner: typeof args.partner === 'object'
        ? args.partner.id
        : args.partner,
    }

    return edit.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
edit.get = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
edit.head = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
const editForm = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
editForm.get = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::edit
* @see app/Http/Controllers/Admin/PartnerAdminController.php:102
* @route '/admin/mitra/{partner}/edit'
*/
editForm.head = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\PartnerAdminController::update
* @see app/Http/Controllers/Admin/PartnerAdminController.php:125
* @route '/admin/mitra/{partner}'
*/
export const update = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/mitra/{partner}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::update
* @see app/Http/Controllers/Admin/PartnerAdminController.php:125
* @route '/admin/mitra/{partner}'
*/
update.url = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partner: typeof args.partner === 'object'
        ? args.partner.id
        : args.partner,
    }

    return update.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::update
* @see app/Http/Controllers/Admin/PartnerAdminController.php:125
* @route '/admin/mitra/{partner}'
*/
update.put = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::update
* @see app/Http/Controllers/Admin/PartnerAdminController.php:125
* @route '/admin/mitra/{partner}'
*/
const updateForm = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::update
* @see app/Http/Controllers/Admin/PartnerAdminController.php:125
* @route '/admin/mitra/{partner}'
*/
updateForm.put = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\PartnerAdminController::destroy
* @see app/Http/Controllers/Admin/PartnerAdminController.php:184
* @route '/admin/mitra/{partner}'
*/
export const destroy = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/mitra/{partner}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::destroy
* @see app/Http/Controllers/Admin/PartnerAdminController.php:184
* @route '/admin/mitra/{partner}'
*/
destroy.url = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partner: typeof args.partner === 'object'
        ? args.partner.id
        : args.partner,
    }

    return destroy.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::destroy
* @see app/Http/Controllers/Admin/PartnerAdminController.php:184
* @route '/admin/mitra/{partner}'
*/
destroy.delete = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::destroy
* @see app/Http/Controllers/Admin/PartnerAdminController.php:184
* @route '/admin/mitra/{partner}'
*/
const destroyForm = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PartnerAdminController::destroy
* @see app/Http/Controllers/Admin/PartnerAdminController.php:184
* @route '/admin/mitra/{partner}'
*/
destroyForm.delete = (args: { partner: string | number | { id: string | number } } | [partner: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PartnerAdminController = { index, create, store, edit, update, destroy }

export default PartnerAdminController